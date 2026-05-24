"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { uploadImagesToCloudinary } from "@/lib/cloudinary/upload";
import { cn } from "@/lib/utils/cn";

const MAX_FILES = 5;
const MAX_MB = 4;

type ImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  className?: string;
};

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
}: ImageUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const canAdd = value.length < MAX_FILES;
  const remaining = MAX_FILES - value.length;

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (disabled || files.length === 0 || !canAdd) return;

      const allowedFiles = files.slice(0, remaining);
      if (files.length > remaining) {
        toast.error(
          `Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed.`,
        );
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const urls = await uploadImagesToCloudinary(allowedFiles, {
          onProgress: (completed, total) => {
            if (total === 0) {
              setUploadProgress(0);
              return;
            }
            setUploadProgress(Math.round((completed / total) * 100));
          },
        });
        if (urls.length > 0) {
          onChange([...value, ...urls].slice(0, MAX_FILES));
          toast.success(
            `${urls.length} image${urls.length === 1 ? "" : "s"} uploaded.`,
          );
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to upload image.";
        toast.error(message);
      } finally {
        setIsUploading(false);
      }
    },
    [canAdd, disabled, onChange, remaining, value],
  );

  const onPickFiles = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      event.target.value = "";
      void handleFiles(files);
    },
    [handleFiles],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragActive(false);
      void handleFiles(Array.from(event.dataTransfer.files));
    },
    [handleFiles],
  );

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled && !isUploading) {
        setIsDragActive(true);
      }
    },
    [disabled, isUploading],
  );

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onRemove = useCallback(
    (url: string) => {
      onChange(value.filter((u) => u !== url));
    },
    [onChange, value],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <p id={`${id}-help`} className="text-xs text-muted-foreground">
        Up to {MAX_FILES} images, {MAX_MB}MB each. JPEG or PNG.
      </p>

      {value.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {value.map((url) => (
            <li
              key={url}
              className="group relative aspect-4/3 overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 200px"
                unoptimized
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                disabled={disabled}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {canAdd ? (
        <div
          className={cn(
            "w-full rounded-xl border-2 border-dashed border-border bg-surface-muted/50 p-6 transition",
            "dark:border-border/40",
            !disabled &&
              !isUploading &&
              "cursor-pointer hover:border-primary/60 hover:bg-primary/5",
            (disabled || isUploading) && "pointer-events-none opacity-70",
            isDragActive && "border-primary bg-primary/10",
          )}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          role="button"
          aria-disabled={disabled || isUploading}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            disabled={disabled || isUploading}
            className="hidden"
            onChange={onPickFiles}
          />
          <div className="flex w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-8 w-8 text-primary" />
            <div className="w-full text-center">
              {isUploading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading... {uploadProgress}%
                </span>
              ) : isDragActive ? (
                "Drop to upload"
              ) : (
                <span>
                  Drag & drop, or click to add photos
                  {remaining < MAX_FILES ? ` (${remaining} left)` : ""}
                </span>
              )}
              {isUploading ? (
                <div
                  className="mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-muted"
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
