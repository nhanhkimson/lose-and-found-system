"use server";

import { revalidatePath } from "next/cache";
import { type ClaimType, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import {
  sendClaimSubmittedEmail,
} from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types";
import {
  createClaimInputSchema,
  type CreateClaimInput,
} from "@/lib/validations/claim.schema";

function mapItemTypeToClaimType(type: "LOST" | "FOUND"): ClaimType {
  if (type === "LOST") return "FINDER";
  return "OWNER";
}

export async function createClaim(
  raw: CreateClaimInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createClaimInputSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      error: first?.message ?? "Invalid input",
    };
  }
  const { itemId, message, proofImageUrls } = parsed.data;

  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be signed in to submit a claim.",
    };
  }
  const userId = session.user.id;

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, type: true, status: true },
    });
    if (!item) {
      return { success: false, error: "Item not found." };
    }
    if (item.status !== "OPEN") {
      return {
        success: false,
        error: "This item is not accepting new claims.",
      };
    }

    const approved = await prisma.claim.findFirst({
      where: { itemId, status: "APPROVED" },
      select: { id: true },
    });
    if (approved) {
      return {
        success: false,
        error: "This item already has an approved claim.",
      };
    }

    const type = mapItemTypeToClaimType(item.type);

    const created = await prisma.claim.create({
      data: {
        itemId,
        userId,
        type,
        message,
        proofImageUrls,
      },
      select: { id: true },
    });

    revalidatePath(`/items/${itemId}`);

    try {
      const [detail, claimant, admins] = await Promise.all([
        prisma.item.findUnique({
          where: { id: itemId },
          select: { title: true, building: true, category: true },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true },
        }),
        prisma.user.findMany({
          where: { role: "ADMIN", email: { not: null } },
          select: { email: true },
        }),
      ]);
      if (detail && claimant) {
        for (const a of admins) {
          if (a.email) {
            await sendClaimSubmittedEmail({
              to: a.email,
              itemTitle: detail.title,
              building: detail.building,
              category: detail.category,
              claimantName: claimant.name?.trim() || "Student",
              claimantEmail: claimant.email,
              claimMessage: message,
              claimId: created.id,
            });
          }
        }
      }
    } catch (e) {
      console.error("[claim] notify admins email failed", e);
    }

    return { success: true, data: { id: created.id } };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          success: false,
          error: "You already submitted a claim for this item.",
        };
      }
    }
    const messageText = e instanceof Error ? e.message : "Failed to submit claim";
    return { success: false, error: messageText };
  }
}
