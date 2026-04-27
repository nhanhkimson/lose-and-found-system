"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth.schema";
import type { ActionResult } from "@/types";

export async function registerAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string") {
        fieldErrors[path] = fieldErrors[path] ?? [];
        fieldErrors[path].push(issue.message);
      }
    }
    return { success: false, error: "Validation failed", fieldErrors };
  }

  const { name, email, studentId, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists",
      fieldErrors: { email: ["This email is already registered"] },
    };
  }

  const trimmedStudent = studentId?.trim();
  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      studentId: trimmedStudent ? trimmedStudent : null,
      password: hashed,
    },
    select: { id: true },
  });

  return { success: true, data: { id: user.id } };
}
