"use client";

import {
  UPLOAD_HELP_TEXT,
  validateUploadInputSize,
  validateUploadMimeType,
} from "@/lib/cloudinary/constants";

function validateImageFile(file: File): void {
  validateUploadMimeType(file.type);
  validateUploadInputSize(file.size);
}

type UploadApiResponse = {
  ok?: boolean;
  url?: string;
  error?: string;
};

/**
 * Upload via POST /api/uploads so the server can convert/compress any image type.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  validateImageFile(file);

  const formData = new FormData();
  formData.append("file", file, file.name || "upload");

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const payload = (await response.json()) as UploadApiResponse;
  if (!response.ok) {
    throw new Error(payload.error ?? "Image upload failed.");
  }

  if (typeof payload.url !== "string" || payload.url.length === 0) {
    throw new Error("Image upload succeeded but URL is missing.");
  }

  return payload.url;
}

export async function uploadImagesToCloudinary(
  files: File[],
  options?: { onProgress?: (completed: number, total: number) => void },
): Promise<string[]> {
  const urls: string[] = [];
  const total = files.length;

  for (const file of files) {
    const url = await uploadImageToCloudinary(file);
    urls.push(url);
    options?.onProgress?.(urls.length, total);
  }

  return urls;
}

export { UPLOAD_HELP_TEXT };
