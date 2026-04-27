import type { ItemDetailPublic } from "@/types";

/** Build ordered image URLs for gallery (legacy `imageUrl` + `imageUrls`). */
export function buildGalleryUrls(
  item: Pick<ItemDetailPublic, "imageUrl" | "imageUrls">,
): string[] {
  const extra = item.imageUrls ?? [];
  if (item.imageUrl) {
    if (extra.length === 0) {
      return [item.imageUrl];
    }
    if (!extra.includes(item.imageUrl)) {
      return [item.imageUrl, ...extra];
    }
  }
  return extra;
}
