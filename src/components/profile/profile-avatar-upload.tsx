"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";
import { cn } from "@/lib/utils/cn";

type ProfileAvatarUploadProps = {
  value: string;
  onChange: (url: string) => void;
  displayName: string;
  disabled?: boolean;
};

export function ProfileAvatarUpload({
  value,
  onChange,
  displayName,
  disabled,
}: ProfileAvatarUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const initial = (displayName[0] ?? "?").toUpperCase();

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || disabled) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
      toast.success("Photo uploaded");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Upload failed.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div
        className={cn(
          "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-muted text-2xl font-semibold text-primary",
        )}
      >
        {value ? (
          <Image
            src={value}
            alt=""
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        ) : (
          initial
        )}
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-overlay/50">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={disabled || isUploading}
          onChange={onFileChange}
        />
        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted disabled:opacity-50"
        >
          <Upload className="h-4 w-4" aria-hidden />
          Upload photo
        </button>
        {value ? (
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-danger"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Remove photo
          </button>
        ) : null}
        <p className="text-xs text-muted-foreground">JPEG or PNG, max 4MB</p>
      </div>
    </div>
  );
}
