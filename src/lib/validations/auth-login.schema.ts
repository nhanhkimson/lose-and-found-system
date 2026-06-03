import { z } from "zod";

export const authLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export type AuthLoginInput = z.infer<typeof authLoginSchema>;
