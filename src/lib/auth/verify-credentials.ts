import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type VerifiedCredentialsUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
};

/** Shared by Credentials provider and POST /api/auth/login. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<VerifiedCredentialsUser | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return null;

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user?.password) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return {
    id: user.id,
    email: user.email ?? normalized,
    name: user.name,
    image: user.image,
    role: user.role,
  };
}
