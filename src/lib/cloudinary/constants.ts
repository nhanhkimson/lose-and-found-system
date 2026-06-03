/** Max size of the original file before server processing. */
export const MAX_UPLOAD_INPUT_BYTES = 25 * 1024 * 1024;

/** Max size after convert/compress (sent to Cloudinary). */
export const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024;

export const MAX_UPLOAD_DIMENSION_PX = 2048;

/** MIME types clients may send; server normalizes to JPEG. */
export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "application/octet-stream",
  "",
]);

export const UPLOAD_ACCEPT_ATTRIBUTE = "image/*";

export const UPLOAD_HELP_TEXT =
  "Photos (JPEG, PNG, WebP, HEIC, GIF, etc.). Large files are auto-compressed to 4MB.";

export function validateUploadInputSize(sizeBytes: number): void {
  if (sizeBytes > MAX_UPLOAD_INPUT_BYTES) {
    throw new Error(
      `Each image must be ${MAX_UPLOAD_INPUT_BYTES / (1024 * 1024)}MB or smaller before processing.`,
    );
  }
  if (sizeBytes <= 0) {
    throw new Error("Image file is empty.");
  }
}

export function validateUploadMimeType(mimeType: string): void {
  const normalized = mimeType.toLowerCase().split(";")[0]?.trim() ?? "";
  if (
    normalized &&
    !ALLOWED_UPLOAD_MIME_TYPES.has(normalized) &&
    !normalized.startsWith("image/")
  ) {
    throw new Error(
      "Unsupported file type. Choose a photo (JPEG, PNG, WebP, HEIC, GIF, etc.).",
    );
  }
}

export function validateUploadSize(sizeBytes: number): void {
  if (sizeBytes > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("Each image must be 4MB or smaller after processing.");
  }
}
