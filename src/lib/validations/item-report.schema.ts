import { z } from "zod";
import type { input, output } from "zod";
import type { ItemCategory, ItemType } from "@prisma/client";
import { endOfDay, isValid } from "date-fns";

const categories = [
  "ELECTRONICS",
  "DOCUMENTS",
  "KEYS",
  "CLOTHING",
  "BOOKS",
  "ACCESSORIES",
  "SPORTS",
  "STATIONERY",
  "BAGS",
  "OTHER",
] as const satisfies readonly ItemCategory[];

const foundDispositions = [
  "STILL_HAVE",
  "SUBMITTED_SECURITY",
  "LEFT_WHERE_FOUND",
] as const;

const emptyToUndef = (s: string | undefined) => {
  const t = s?.trim();
  return t ? t : undefined;
};

export const itemReportFormSchema = z
  .object({
    type: z.enum(["LOST", "FOUND"] satisfies [ItemType, ItemType]),
    title: z.string().min(3, "Add a short title").max(200),
    description: z
      .string()
      .min(10, "Add a bit more detail (at least 10 characters)")
      .max(10000),
    category: z.enum(categories),
    color: z.string().max(120).default(""),
    brand: z.string().max(120).default(""),
    building: z.string().min(1, "Select a building"),
    roomHint: z
      .string()
      .min(1, "Describe the specific location")
      .max(2000),
    eventDate: z.coerce.date().refine((d) => isValid(d), "Choose a date"),
    timeApprox: z.string().max(200).default(""),
    foundDisposition: z
      .union([z.enum(foundDispositions), z.literal("")])
      .optional()
      .transform((v) => (v === "" || v === undefined ? undefined : v)),
    imageUrls: z.array(z.string().min(1)).max(5),
    reward: z.string().max(200).default(""),
    notifyOnMatch: z.boolean(),
    allowContact: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (endOfDay(data.eventDate) > endOfDay(new Date())) {
      ctx.addIssue({
        code: "custom",
        path: ["eventDate"],
        message: "Date cannot be in the future",
      });
    }
    if (data.type === "LOST") {
      if (!emptyToUndef(data.timeApprox)) {
        ctx.addIssue({
          code: "custom",
          path: ["timeApprox"],
          message: "Add an approximate time",
        });
      }
    }
    if (data.type === "FOUND" && !data.foundDisposition) {
      ctx.addIssue({
        code: "custom",
        path: ["foundDisposition"],
        message: "Select where the item is now",
      });
    }
  });

export type ItemReportFormValues = input<typeof itemReportFormSchema>;
export type ItemReportFormOutput = output<typeof itemReportFormSchema>;
