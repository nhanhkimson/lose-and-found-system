"use client";

const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

type CloudinaryErrorPayload = {
  error?: {
    message?: string;
  };
};

function readCloudinaryPublicConfig(): {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
} {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  return { cloudName, uploadPreset, folder };
}

function validateImageFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Only JPEG and PNG files are supported.");
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("Each image must be 4MB or smaller.");
  }
}

function parseCloudinaryError(payload: unknown, fallback: string): string {
  if (typeof payload !== "object" || payload === null) return fallback;
  const maybePayload = payload as CloudinaryErrorPayload;
  if (typeof maybePayload.error?.message === "string" && maybePayload.error.message) {
    return maybePayload.error.message;
  }
  return fallback;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  validateImageFile(file);
  const { cloudName, uploadPreset, folder } = readCloudinaryPublicConfig();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload: unknown = await response.json();
  if (!response.ok) {
    throw new Error(parseCloudinaryError(payload, "Image upload failed."));
  }

  if (typeof payload !== "object" || payload === null) {
    throw new Error("Image upload failed.");
  }

  const secureUrl = (payload as { secure_url?: unknown }).secure_url;
  if (typeof secureUrl !== "string" || secureUrl.length === 0) {
    throw new Error("Image upload succeeded but URL is missing.");
  }

  return secureUrl;
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
