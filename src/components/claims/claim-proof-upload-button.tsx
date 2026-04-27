"use client";

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

export const ClaimProofUploadButton = generateUploadButton<OurFileRouter>();
