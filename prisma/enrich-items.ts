import { PrismaClient, type ItemCategory, type ItemType } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORY_LABEL: Record<ItemCategory, string> = {
  ELECTRONICS: "electronic item",
  DOCUMENTS: "document",
  KEYS: "key set",
  CLOTHING: "clothing item",
  BOOKS: "book",
  ACCESSORIES: "accessory",
  SPORTS: "sports equipment",
  STATIONERY: "stationery set",
  BAGS: "bag",
  OTHER: "personal item",
};

const KEYWORD_IMAGE_SOURCES: ReadonlyArray<{
  keywords: readonly string[];
  imageSource: string;
}> = [
  {
    keywords: ["phone", "iphone", "android", "smartphone", "mobile"],
    imageSource:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["laptop", "macbook", "notebook"],
    imageSource:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["mouse"],
    imageSource:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["id card", "student id", "passport", "document", "card"],
    imageSource:
      "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["key", "keychain", "key fob"],
    imageSource:
      "https://images.unsplash.com/photo-1563225409-127c18758bd5?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["jacket", "windbreaker", "beanie", "clothing"],
    imageSource:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["book", "textbook", "binder"],
    imageSource:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["bracelet", "watch", "wristwatch"],
    imageSource:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["badminton", "racket", "shuttle", "sports"],
    imageSource:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["pen", "marker", "ruler", "compass", "stationery"],
    imageSource:
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["backpack", "bag", "sleeve"],
    imageSource:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["umbrella"],
    imageSource:
      "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["adapter", "usb-c", "hdmi", "charger", "cable"],
    imageSource:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1400&q=80",
  },
];

const CATEGORY_IMAGE_SOURCES: Record<ItemCategory, readonly string[]> = {
  ELECTRONICS: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
  ],
  DOCUMENTS: [
    "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
  ],
  KEYS: [
    "https://images.unsplash.com/photo-1563225409-127c18758bd5?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80",
  ],
  CLOTHING: [
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
  ],
  BOOKS: [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80",
  ],
  ACCESSORIES: [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1615655096345-61a54750068f?auto=format&fit=crop&w=1400&q=80",
  ],
  SPORTS: [
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80",
  ],
  STATIONERY: [
    "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
  ],
  BAGS: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80",
  ],
  OTHER: [
    "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
  ],
};

function hashToIndex(input: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h % modulo;
}

function buildPhone(index: number): string {
  const base = 1000000 + index * 9137;
  const asText = String(base).padStart(7, "0");
  return `+855 ${asText.slice(0, 2)} ${asText.slice(2, 5)} ${asText.slice(5, 7)}`;
}

function pickImageForItem(
  title: string,
  description: string,
  category: ItemCategory,
  stableIndex: number,
): string {
  const searchText = `${title} ${description}`.toLowerCase();

  const keywordMatch = KEYWORD_IMAGE_SOURCES.find((entry) =>
    entry.keywords.some((keyword) => searchText.includes(keyword)),
  );
  if (keywordMatch) {
    return keywordMatch.imageSource;
  }

  const fallbackSources = CATEGORY_IMAGE_SOURCES[category];
  const source = fallbackSources[stableIndex % fallbackSources.length]!;
  return source;
}

function isGenericDemoImage(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith("https://res.cloudinary.com/demo/");
}

function needsBetterTitle(title: string): boolean {
  const t = title.trim().toLowerCase();
  if (t.length < 8) return true;
  if (["new", "item", "lost item", "found item", "lost", "found"].includes(t)) {
    return true;
  }
  return false;
}

function needsBetterDescription(description: string): boolean {
  return description.trim().length < 40;
}

type ItemForText = {
  type: ItemType;
  category: ItemCategory;
  building: string;
  roomHint: string | null;
};

function buildBetterTitle(item: ItemForText): string {
  const prefix = item.type === "LOST" ? "Lost" : "Found";
  return `${prefix} ${CATEGORY_LABEL[item.category]} near ${item.building}`;
}

function buildBetterDescription(item: ItemForText): string {
  const typeText =
    item.type === "LOST"
      ? "Owner reported this item missing on campus."
      : "This item was found on campus and reported to the Lost & Found team.";
  const locationText = item.roomHint
    ? `Last known location: ${item.roomHint}, ${item.building}.`
    : `Last known location: ${item.building}.`;
  const contactText =
    "Please contact the listed owner/reporter with identifying details to verify the claim.";
  return `${typeText} ${locationText} ${contactText}`;
}

async function main() {
  const items = await prisma.item.findMany({
    select: {
      id: true,
      type: true,
      category: true,
      building: true,
      roomHint: true,
      title: true,
      description: true,
      contactPhone: true,
      imageUrl: true,
      imageUrls: true,
    },
  });

  let updatedRows = 0;
  let phonesUpdated = 0;
  let imagesUpdated = 0;
  let titlesUpdated = 0;
  let descriptionsUpdated = 0;

  for (const item of items) {
    const next: {
      contactPhone?: string;
      imageUrl?: string;
      title?: string;
      description?: string;
    } = {};
    const stableIndex = hashToIndex(item.id, 9000);

    if (!item.contactPhone || item.contactPhone.trim().length === 0) {
      next.contactPhone = buildPhone(stableIndex);
      phonesUpdated += 1;
    }

    const hasImage =
      Boolean(item.imageUrl && item.imageUrl.trim().length > 0) ||
      item.imageUrls.length > 0;
    if (!hasImage || isGenericDemoImage(item.imageUrl)) {
      next.imageUrl = pickImageForItem(
        item.title,
        item.description,
        item.category,
        stableIndex,
      );
      imagesUpdated += 1;
    }

    if (needsBetterTitle(item.title)) {
      next.title = buildBetterTitle(item);
      titlesUpdated += 1;
    }

    if (needsBetterDescription(item.description)) {
      next.description = buildBetterDescription(item);
      descriptionsUpdated += 1;
    }

    if (Object.keys(next).length > 0) {
      await prisma.item.update({
        where: { id: item.id },
        data: next,
      });
      updatedRows += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        totalRows: items.length,
        updatedRows,
        phonesUpdated,
        imagesUpdated,
        titlesUpdated,
        descriptionsUpdated,
      },
      null,
      2,
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
