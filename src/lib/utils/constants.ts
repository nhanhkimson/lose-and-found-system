import type { ItemCategory, ItemStatus, ItemType } from "@prisma/client";

export const APP_NAME = "BIU Lost & Found";

export const APP_DESCRIPTION =
  "Report and browse lost and found items on the Build Bright University campus.";

/** Primary routes used across the app */
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
} as const;

export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 48,
} as const;

/** BIU brand (see `.cursorrules`) */
export const BRAND = {
  gold: "#B8860B",
  navy: "#1a1a2e",
} as const;

export const TYPE_BADGE = {
  LOST: { className: "bg-red-100 text-red-700" },
  FOUND: { className: "bg-green-100 text-green-700" },
} as const satisfies Record<ItemType, { className: string }>;

export const TYPE_LABEL: Record<ItemType, string> = {
  LOST: "Lost",
  FOUND: "Found",
};

export const STATUS_LABEL: Record<ItemStatus, string> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const STATUS_FILTER_OPTIONS: { value: ItemStatus; label: string }[] = (
  Object.keys(STATUS_LABEL) as ItemStatus[]
).map((value) => ({ value, label: STATUS_LABEL[value] }));

export const CATEGORY_LABEL: Record<ItemCategory, string> = {
  ELECTRONICS: "Electronics & tech",
  DOCUMENTS: "Documents & ID",
  KEYS: "Keys & access cards",
  CLOTHING: "Clothing & wearables",
  BOOKS: "Books & notes",
  ACCESSORIES: "Accessories & jewelry",
  SPORTS: "Sports & recreation",
  STATIONERY: "Stationery & supplies",
  BAGS: "Bags & luggage",
  OTHER: "Other",
};

export const CATEGORIES = [
  { value: "ELECTRONICS" as const, label: CATEGORY_LABEL.ELECTRONICS },
  { value: "DOCUMENTS" as const, label: CATEGORY_LABEL.DOCUMENTS },
  { value: "KEYS" as const, label: CATEGORY_LABEL.KEYS },
  { value: "CLOTHING" as const, label: CATEGORY_LABEL.CLOTHING },
  { value: "BOOKS" as const, label: CATEGORY_LABEL.BOOKS },
  { value: "ACCESSORIES" as const, label: CATEGORY_LABEL.ACCESSORIES },
  { value: "SPORTS" as const, label: CATEGORY_LABEL.SPORTS },
  { value: "STATIONERY" as const, label: CATEGORY_LABEL.STATIONERY },
  { value: "BAGS" as const, label: CATEGORY_LABEL.BAGS },
  { value: "OTHER" as const, label: CATEGORY_LABEL.OTHER },
] as const;

/** Representative BIU campus locations for filters and forms */
export const CAMPUS_BUILDINGS = [
  "Main Block A (Administration & Classes)",
  "Main Block B (Faculty of Business)",
  "Library & Learning Center",
  "IT & Innovation Lab",
  "Engineering & Tech Building",
  "Science & Language Block",
  "Student Center & Cafeteria",
  "Dormitory East (Student Housing)",
  "Dormitory West (Student Housing)",
  "Sports Complex & Gymnasium",
] as const;

export type CampusBuilding = (typeof CAMPUS_BUILDINGS)[number];
