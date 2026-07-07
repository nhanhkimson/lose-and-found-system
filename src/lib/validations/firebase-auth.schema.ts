import { z } from "zod";

export const firebaseAuthSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required"),
  studentId: z.string().max(50).optional(),
  name: z.string().max(120).optional(),
});

export type FirebaseAuthInput = z.infer<typeof firebaseAuthSchema>;
