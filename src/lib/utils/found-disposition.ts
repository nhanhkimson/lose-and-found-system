import type { FoundDisposition } from "@prisma/client";

export const FOUND_DISPOSITION_OPTIONS: {
  value: FoundDisposition;
  label: string;
}[] = [
  { value: "STILL_HAVE", label: "I still have it" },
  { value: "SUBMITTED_SECURITY", label: "Submitted to security office" },
  { value: "LEFT_WHERE_FOUND", label: "Left where found" },
];
