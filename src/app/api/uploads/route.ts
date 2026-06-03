import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/api-session";
import { uploadImageBufferToCloudinary } from "@/lib/cloudinary/server-upload";

export async function POST(request: Request) {
  try {
    const session = await getApiSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file. Use multipart field name `file`." },
        { status: 400 },
      );
    }

    const folderField = formData.get("folder");
    const folder =
      typeof folderField === "string" && folderField.trim()
        ? folderField.trim()
        : undefined;

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBufferToCloudinary({
      buffer,
      mimeType: file.type || "application/octet-stream",
      fileName: file.name || "upload.jpg",
      folder,
    });

    return NextResponse.json({
      ok: true,
      url,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image upload failed.";
    const isClientError =
      message.includes("Unsupported") ||
      message.includes("too large") ||
      message.includes("4MB") ||
      message.includes("25MB") ||
      message.includes("empty") ||
      message.includes("Missing file");
    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 },
    );
  }
}
