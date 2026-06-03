import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  studentId: z.string().max(50),
  image: z.string().max(2000),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
