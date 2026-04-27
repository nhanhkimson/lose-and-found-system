"use server";

import { subDays } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchConfidencePercent, type SuggestionSide } from "@/lib/utils/match-score";

const MATCH_WINDOW_DAYS = 90;
const MAX_SUGGESTIONS = 8;

type ItemForMatch = {
  id: string;
  type: SuggestionSide;
  category: import("@prisma/client").ItemCategory;
  building: string;
  title: string;
  status: import("@prisma/client").ItemStatus;
  createdAt: Date;
  userId: string | null;
};

export type DashboardStats = {
  myLost: number;
  myFound: number;
  myClaims: number;
  myResolved: number;
};

export type MatchSuggestionRow = {
  id: string;
  /** Your item id (anchor) */
  myItemId: string;
  myItemTitle: string;
  mySide: SuggestionSide;
  otherItemId: string;
  otherTitle: string;
  otherSide: SuggestionSide;
  category: import("@prisma/client").ItemCategory;
  building: string;
  confidence: number;
};

export type ActivityRow =
  | {
      kind: "item";
      id: string;
      itemId: string;
      title: string;
      type: SuggestionSide;
      status: import("@prisma/client").ItemStatus;
      at: Date;
    }
  | {
      kind: "claim";
      id: string;
      itemId: string;
      itemTitle: string;
      claimStatus: import("@prisma/client").ClaimStatus;
      at: Date;
    };

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;
  const [myLost, myFound, myClaims, myResolved] = await Promise.all([
    prisma.item.count({ where: { userId, type: "LOST" } }),
    prisma.item.count({ where: { userId, type: "FOUND" } }),
    prisma.claim.count({ where: { userId } }),
    prisma.item.count({ where: { userId, status: "RESOLVED" } }),
  ]);
  return { myLost, myFound, myClaims, myResolved };
}

function scorePair(
  mine: ItemForMatch,
  other: ItemForMatch,
  expectOther: SuggestionSide,
): number | null {
  if (other.type !== expectOther) return null;
  if (other.status !== "OPEN" || mine.status !== "OPEN") return null;
  if (other.id === mine.id) return null;
  if (other.userId && other.userId === mine.userId) return null;
  const minDate = subDays(new Date(), MATCH_WINDOW_DAYS);
  if (other.createdAt < minDate) return null;
  if (other.category !== mine.category) return null;

  return matchConfidencePercent({
    categoryMatch: true,
    buildingMatch: other.building === mine.building,
    titleA: mine.title,
    titleB: other.title,
  });
}

/**
 * Heuristic: pair user's OPEN LOST with others' OPEN FOUND in same category (and vice versa).
 */
export async function getMatchSuggestions(): Promise<MatchSuggestionRow[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const userId = session.user.id;

  const [myItems, pool] = await Promise.all([
    prisma.item.findMany({
      where: { userId, status: "OPEN" },
      select: {
        id: true,
        type: true,
        category: true,
        building: true,
        title: true,
        status: true,
        createdAt: true,
        userId: true,
      },
    }) as Promise<ItemForMatch[]>,
    prisma.item.findMany({
      where: {
        status: "OPEN",
        createdAt: { gte: subDays(new Date(), MATCH_WINDOW_DAYS) },
      },
      select: {
        id: true,
        type: true,
        category: true,
        building: true,
        title: true,
        status: true,
        createdAt: true,
        userId: true,
      },
    }) as Promise<ItemForMatch[]>,
  ]);

  const results: MatchSuggestionRow[] = [];

  for (const mine of myItems) {
    const want: SuggestionSide = mine.type === "LOST" ? "FOUND" : "LOST";
    for (const other of pool) {
      if (other.id === mine.id) continue;
      const c = scorePair(mine, other, want);
      if (c == null) continue;
      if (c < 40) continue;
      results.push({
        id: `${mine.id}-${other.id}`,
        myItemId: mine.id,
        myItemTitle: mine.title,
        mySide: mine.type as SuggestionSide,
        otherItemId: other.id,
        otherTitle: other.title,
        otherSide: other.type as SuggestionSide,
        category: other.category,
        building: other.building,
        confidence: c,
      });
    }
  }

  results.sort((a, b) => b.confidence - a.confidence);
  const seen = new Set<string>();
  const out: MatchSuggestionRow[] = [];
  for (const r of results) {
    const key = `${r.myItemId}-${r.otherItemId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
    if (out.length >= MAX_SUGGESTIONS) break;
  }
  return out;
}

export async function getRecentActivity(): Promise<ActivityRow[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const userId = session.user.id;

  const [itemRows, claimRows] = await Promise.all([
    prisma.item.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        updatedAt: true,
        createdAt: true,
      },
    }),
    prisma.claim.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        status: true,
        createdAt: true,
        item: { select: { id: true, title: true } },
      },
    }),
  ]);

  const activities: ActivityRow[] = [
    ...itemRows.map(
      (i): ActivityRow => ({
        kind: "item",
        id: `i-${i.id}`,
        itemId: i.id,
        title: i.title,
        type: i.type as SuggestionSide,
        status: i.status,
        at: i.updatedAt,
      }),
    ),
    ...claimRows.map(
      (c): ActivityRow => ({
        kind: "claim",
        id: `c-${c.id}`,
        itemId: c.item.id,
        itemTitle: c.item.title,
        claimStatus: c.status,
        at: c.createdAt,
      }),
    ),
  ];
  activities.sort((a, b) => b.at.getTime() - a.at.getTime());
  return activities.slice(0, 10);
}
