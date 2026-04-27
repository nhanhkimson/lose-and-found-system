import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ItemClaimPanel } from "@/components/claims/claim-form";
import { ItemDetail } from "@/components/items/item-detail";
import { ItemGallery } from "@/components/items/item-gallery";
import { ItemGrid } from "@/components/items/item-grid";
import {
  getItemById,
  getItemByIdNoTrack,
  getSimilarItems,
} from "@/lib/actions/item.actions";
import { buildGalleryUrls } from "@/lib/utils/item-gallery";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemByIdNoTrack(id);
  if (!item) {
    return { title: "Item" };
  }
  return { title: item.title };
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getItemById(id);
  if (!item) {
    notFound();
  }

  const similar = await getSimilarItems(item.id, item.category);
  const galleryUrls = buildGalleryUrls(item);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-1 sm:px-0">
      <div>
        <Link
          href="/items"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 transition hover:text-biu-navy dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back to listings
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-12">
        <div className="min-w-0 space-y-8">
          <ItemGallery
            imageUrls={galleryUrls}
            title={item.title}
            category={item.category}
          />
          <ItemDetail item={item} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <ItemClaimPanel item={item} />
          </div>
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="border-t border-zinc-100 pt-10 dark:border-zinc-800">
          <h2 className="mb-6 text-lg font-semibold text-biu-navy dark:text-zinc-100">
            Similar items
          </h2>
          <ItemGrid items={similar} />
        </section>
      ) : null}
    </div>
  );
}
