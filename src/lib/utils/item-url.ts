/**
 * Build `/items?…` with stable param handling for pagination and filters.
 */
export function withItemsParams(
  current: Readonly<URLSearchParams> | { toString: () => string } | string,
  updates: Record<string, string | null | undefined>,
) {
  const sp = new URLSearchParams(
    typeof current === "string" ? current : current.toString(),
  );

  for (const [k, v] of Object.entries(updates)) {
    if (v === null || v === undefined || v === "") {
      sp.delete(k);
    } else {
      sp.set(k, v);
    }
  }
  const qs = sp.toString();
  return qs ? `/items?${qs}` : "/items";
}
