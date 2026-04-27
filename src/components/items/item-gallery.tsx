"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { ItemCategory } from "@prisma/client";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CategoryIcon } from "@/components/items/category-icon";
import { cn } from "@/lib/utils/cn";

type ItemGalleryProps = {
  imageUrls: string[];
  title: string;
  category: ItemCategory;
};

export function ItemGallery({ imageUrls, title, category }: ItemGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback((a: CarouselApi) => {
    if (!a) return;
    setCurrent(a.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  if (imageUrls.length === 0) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
        aria-label={`No image — ${title}`}
      >
        <CategoryIcon category={category} size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {imageUrls.map((src, index) => (
            <CarouselItem key={`${src}-${index}`}>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                <Image
                  src={src}
                  alt={imageUrls.length > 1 ? `${title} — image ${index + 1}` : title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 65vw"
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {imageUrls.length > 1 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {imageUrls.map((src, index) => (
            <button
              type="button"
              key={`thumb-${src}-${index}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition",
                current === index
                  ? "border-biu-gold ring-1 ring-biu-gold/40"
                  : "border-transparent ring-1 ring-zinc-200 dark:ring-zinc-700",
              )}
              aria-label={`Show image ${index + 1}`}
              aria-current={current === index}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
