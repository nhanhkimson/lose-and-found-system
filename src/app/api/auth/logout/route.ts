import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Sign out (clear session cookie)
 *     description: Clears the NextAuth session cookie on this origin.
 *     security: []
 *     responses:
 *       200:
 *         description: Signed out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               required: [ok, message]
 */
export async function POST() {
  try {
    await signOut({ redirect: false });
    return NextResponse.json({
      ok: true,
      message: "Session cleared.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Logout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
