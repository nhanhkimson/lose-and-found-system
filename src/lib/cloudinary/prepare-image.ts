import sharp from "sharp";
import {
  MAX_UPLOAD_DIMENSION_PX,
  MAX_UPLOAD_SIZE_BYTES,
  validateUploadInputSize,
} from "@/lib/cloudinary/constants";

const SUPPORTED_SHARP_FORMATS = new Set([
  "jpeg",
  "jpg",
  "png",
  "webp",
  "gif",
  "heif",
  "heic",
  "avif",
  "tiff",
  "bmp",
  "raw",
]);

export type PreparedImage = {
  buffer: Buffer;
  mimeType: "image/jpeg";
  fileName: string;
};

function outputFileName(fileName?: string): string {
  const base = (fileName ?? "upload").replace(/\.[^.]+$/, "") || "upload";
  return `${base}.jpg`;
}

async function encodeJpeg(
  input: Buffer,
  options: { maxDimension: number; quality: number },
): Promise<Buffer> {
  return sharp(input, { failOn: "none", animated: true })
    .rotate()
    .resize(options.maxDimension, options.maxDimension, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: options.quality, mozjpeg: true })
    .toBuffer();
}

/**
 * Converts any supported photo to JPEG, auto-rotates, resizes, and compresses under 4MB.
 */
export async function prepareImageForUpload(input: {
  buffer: Buffer;
  mimeType?: string;
  fileName?: string;
}): Promise<PreparedImage> {
  validateUploadInputSize(input.buffer.byteLength);

  const meta = await sharp(input.buffer, { failOn: "none" }).metadata();
  const format = meta.format?.toLowerCase();

  if (!format || !SUPPORTED_SHARP_FORMATS.has(format)) {
    throw new Error(
      "Unsupported image format. Use a common photo type (JPEG, PNG, WebP, HEIC, GIF, etc.).",
    );
  }

  const dimensions = [
    MAX_UPLOAD_DIMENSION_PX,
    1600,
    1280,
    1024,
  ] as const;
  const qualities = [88, 78, 68, 58, 48, 40] as const;

  let lastBuffer: Buffer | null = null;

  for (const maxDimension of dimensions) {
    for (const quality of qualities) {
      const encoded = await encodeJpeg(input.buffer, { maxDimension, quality });
      lastBuffer = encoded;
      if (encoded.byteLength <= MAX_UPLOAD_SIZE_BYTES) {
        return {
          buffer: encoded,
          mimeType: "image/jpeg",
          fileName: outputFileName(input.fileName),
        };
      }
    }
  }

  if (!lastBuffer) {
    throw new Error("Could not process image.");
  }

  if (lastBuffer.byteLength > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error(
      "Image is still too large after compression. Try a smaller photo.",
    );
  }

  return {
    buffer: lastBuffer,
    mimeType: "image/jpeg",
    fileName: outputFileName(input.fileName),
  };
}
