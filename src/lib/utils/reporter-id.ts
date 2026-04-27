/**
 * Deterministic, non-reversible public code for the poster (no PII).
 */
export function getReporterAnonCode(itemId: string): string {
  let h = 0;
  for (let i = 0; i < itemId.length; i += 1) {
    h = (h * 33 + itemId.charCodeAt(i)) | 0;
  }
  const n = (Math.abs(h) % 9000) + 1000;
  return `BIU-${n}`;
}
