import type { ItemCategory } from "@prisma/client";
import {
  BookOpen,
  Dumbbell,
  FileText,
  KeyRound,
  type LucideIcon,
  Package,
  Pen,
  Shirt,
  ShoppingBag,
  Smartphone,
  Watch,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const BY_CATEGORY: Record<ItemCategory, LucideIcon> = {
  ELECTRONICS: Smartphone,
  DOCUMENTS: FileText,
  KEYS: KeyRound,
  CLOTHING: Shirt,
  BOOKS: BookOpen,
  ACCESSORIES: Watch,
  SPORTS: Dumbbell,
  STATIONERY: Pen,
  BAGS: ShoppingBag,
  OTHER: Package,
};

type CategoryIconProps = {
  category: ItemCategory;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASS = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-20 w-20",
} as const;

export function CategoryIcon({ category, className, size = "md" }: CategoryIconProps) {
  const Icon = BY_CATEGORY[category] ?? Package;
  return (
    <Icon
      className={cn("text-biu-gold/50", SIZE_CLASS[size], className)}
      strokeWidth={1.25}
      aria-hidden
    />
  );
}
