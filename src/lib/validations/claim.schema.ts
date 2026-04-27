import { z } from "zod";

export const createClaimInputSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  message: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(8000),
  proofImageUrls: z
    .array(z.string().min(1))
    .max(3, "At most 3 photos")
    .default([]),
});

export type CreateClaimInput = z.infer<typeof createClaimInputSchema>;
