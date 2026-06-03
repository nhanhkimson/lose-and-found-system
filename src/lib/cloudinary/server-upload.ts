import { validateUploadSize } from "@/lib/cloudinary/constants";
import { prepareImageForUpload } from "@/lib/cloudinary/prepare-image";

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

export function readCloudinaryPublicUploadConfig(): {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
} {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  return { cloudName, uploadPreset, folder };
}

export async function uploadImageBufferToCloudinary(input: {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  folder?: string;
}): Promise<string> {
  const prepared = await prepareImageForUpload({
    buffer: input.buffer,
    mimeType: input.mimeType,
    fileName: input.fileName,
  });
  validateUploadSize(prepared.buffer.byteLength);

  const { cloudName, uploadPreset, folder } = readCloudinaryPublicUploadConfig();
  const targetFolder =
    input.folder?.trim() || folder?.trim() || "biu-lost-found";

  const blob = new Blob([new Uint8Array(prepared.buffer)], {
    type: prepared.mimeType,
  });
  const formData = new FormData();
  formData.append("file", blob, prepared.fileName);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", targetFolder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  const payload = (await response.json()) as CloudinaryUploadResponse;
  if (!response.ok) {
    throw new Error(
      payload.error?.message ?? "Image upload failed.",
    );
  }

  if (!payload.secure_url) {
    throw new Error("Image upload succeeded but URL is missing.");
  }

  return payload.secure_url;
}
