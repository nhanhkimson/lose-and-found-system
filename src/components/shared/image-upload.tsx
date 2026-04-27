"use client";

import { generateUploadDropzone } from "@uploadthing/react";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useId } from "react";
import { toast } from "sonner";
import type { OurFileRouter } from "@/lib/uploadthing";
import { cn } from "@/lib/utils/cn";

const ItemImageDropzone = generateUploadDropzone<OurFileRouter>();

const MAX_FILES = 5;
const MAX_MB = 4;

function pickFileUrl(f: unknown): string {
  if (typeof f !== "object" || f === null) return "";
  const o = f as Record<string, unknown>;
  if (typeof o.url === "string" && o.url) return o.url;
  if (typeof o.ufsUrl === "string" && o.ufsUrl) return o.ufsUrl;
  if (typeof o.fileUrl === "string" && o.fileUrl) return o.fileUrl;
  return "";
}

type ImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  className?: string;
};

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
  const id = useId();
  const canAdd = value.length < MAX_FILES;
  const remaining = MAX_FILES - value.length;

  const onRemove = useCallback(
    (url: string) => {
      onChange(value.filter((u) => u !== url));
    },
    [onChange, value],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <p id={`${id}-help`} className="text-xs text-zinc-500">
        Up to {MAX_FILES} images, {MAX_MB}MB each. JPEG or PNG.
      </p>

      {value.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {value.map((url) => (
            <li
              key={url}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
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
        <ItemImageDropzone
          endpoint="imageUploader"
          disabled={disabled}
          onClientUploadComplete={(res) => {
            const next = res.map((f) => pickFileUrl(f)).filter(Boolean);
            if (next.length === 0) return;
            onChange([...value, ...next].slice(0, MAX_FILES));
          }}
          onUploadError={(e) => {
            toast.error(e.message);
          }}
          className="w-full"
          appearance={{
            container: (args) =>
              cn(
                "w-full cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-6 transition",
                "hover:border-biu-gold/60 hover:bg-biu-gold/5",
                "dark:border-zinc-600 dark:bg-zinc-900/40",
                args.isUploading && "pointer-events-none opacity-70",
                args.isDragActive && "border-biu-gold bg-biu-gold/10",
              ),
            label: () =>
              "flex w-full flex-col items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-300",
            allowedContent: () => "hidden",
            uploadIcon: () => "h-8 w-8 text-biu-gold",
          }}
          content={{
            uploadIcon: () => <Upload className="h-8 w-8 text-biu-gold" />,
            label: (args) => (
              <div className="w-full text-center">
                {args.isUploading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading… {args.uploadProgress}%
                  </span>
                ) : args.isDragActive ? (
                  "Drop to upload"
                ) : (
                  <span>
                    Drag & drop, or click to add photos
                    {remaining < MAX_FILES ? ` (${remaining} left)` : ""}
                  </span>
                )}
                {args.isUploading ? (
                  <div
                    className="mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
                    role="progressbar"
                    aria-valuenow={args.uploadProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-biu-gold transition-all"
                      style={{ width: `${args.uploadProgress}%` }}
                    />
                  </div>
                ) : null}
              </div>
            ),
          }}
        />
      ) : null}
    </div>
  );
}
