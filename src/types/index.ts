import type {
  FoundDisposition,
  Item,
  ItemCategory,
  ItemStatus,
  ItemType,
  Prisma,
} from "@prisma/client";

export type {
  FoundDisposition,
  Item,
  ItemCategory,
  ItemStatus,
  ItemType,
};

/**
 * Standard Server Action return shape (see `.cursorrules`).
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Public-safe list row (no contact details).
 */
export type ItemListItem = Pick<
  Item,
  "id" | "type" | "title" | "category" | "building" | "roomHint" | "eventDate" | "imageUrl" | "createdAt"
>;

/** Full row from DB (includes contacts) — use `ItemDetailPublic` for UI. */
export type ItemDetail = Item;

export const itemListSelect = {
  id: true,
  type: true,
  title: true,
  category: true,
  building: true,
  roomHint: true,
  eventDate: true,
  imageUrl: true,
  createdAt: true,
} satisfies Prisma.ItemSelect;

export type ItemListRow = Prisma.ItemGetPayload<{ select: typeof itemListSelect }>;

/** Public item detail: no PII; view count and gallery fields. */
export const itemDetailPublicSelect = {
  id: true,
  type: true,
  status: true,
  title: true,
  description: true,
  category: true,
  building: true,
  roomHint: true,
  imageUrl: true,
  imageUrls: true,
  color: true,
  brand: true,
  eventDate: true,
  timeApprox: true,
  foundDisposition: true,
  reward: true,
  notifyOnMatch: true,
  allowContact: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ItemSelect;

export type ItemDetailPublic = Prisma.ItemGetPayload<{
  select: typeof itemDetailPublicSelect;
}>;
