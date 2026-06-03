import { z } from "zod";

const optionalUrlOrEmpty = z
  .string()
  .max(2000)
  .refine(
    (v) => {
      const t = v.trim();
      if (!t) return true;
      try {
        new URL(t);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Enter a valid image URL or leave empty" },
  );

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  studentId: z.string().max(50),
  image: optionalUrlOrEmpty,
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const profilePasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfilePasswordChangeInput = z.infer<
  typeof profilePasswordChangeSchema
>;
