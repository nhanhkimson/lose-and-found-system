import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

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
