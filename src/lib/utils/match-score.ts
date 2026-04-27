const STOP = new Set([
  "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "of", "with", "is", "it",
  "laptop", "phone", "black", "white", "blue", "red", "small", "big",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9äöüéàèùâêîôûç\s]/gi, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/** Jaccard on word sets, 0–1 */
export function titleSimilarity(a: string, b: string): number {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) {
    if (B.has(w)) inter += 1;
  }
  return inter / (A.size + B.size - inter);
}

export function matchConfidencePercent(input: {
  categoryMatch: boolean;
  buildingMatch: boolean;
  titleA: string;
  titleB: string;
}): number {
  const t = titleSimilarity(input.titleA, input.titleB);
  const cat = input.categoryMatch ? 1 : 0;
  const bld = input.buildingMatch ? 1 : 0;
  // Weighted sum → 0–100
  const raw = 22 + cat * 28 + bld * 22 + t * 48;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export type SuggestionSide = "LOST" | "FOUND";

export function confidenceBadgeClass(percent: number): string {
  if (percent >= 70) {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200";
  }
  if (percent >= 50) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200";
  }
  return "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200";
}
