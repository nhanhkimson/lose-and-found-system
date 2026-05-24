import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getCloudinaryServerConfig,
  signCloudinaryParams,
} from "@/lib/cloudinary/server";

/**
 * @swagger
 * /api/uploads/signature:
 * post:
 * tags: [Uploads]
 * summary: Create Cloudinary signed-upload payload
 * description: Requires authenticated session cookie. Use this for mobile/web secure uploads.
 * requestBody:
 * required: false
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * folder:
 * type: string
 * example: biu-lost-found
 * responses:
 * 200:
 * description: Signed payload for direct Cloudinary upload.
 * 401:
 * description: Unauthorized.
 * 500:
 * description: Cloudinary server configuration missing.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = getCloudinaryServerConfig();
    if (!config) {
      return NextResponse.json(
        {
          error:
            "Missing Cloudinary server configuration. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.",
        },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      folder?: string;
    };
    const folder =
      body.folder?.trim() ||
      process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ||
      "biu-lost-found";
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = signCloudinaryParams(
      { folder, timestamp },
      config.apiSecret,
    );

    return NextResponse.json({
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      folder,
      timestamp,
      signature,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create upload signature.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
