export const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024;
export const ALLOWED_UPLOAD_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

export function validateUploadMimeType(mimeType: string): void {
  if (!ALLOWED_UPLOAD_MIME_TYPES.has(mimeType)) {
    throw new Error("Only JPEG and PNG files are supported.");
  }
}

export function validateUploadSize(sizeBytes: number): void {
  if (sizeBytes > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("Each image must be 4MB or smaller.");
  }
}
