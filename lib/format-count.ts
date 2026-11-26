/** Compact count for badges: 950 → "950", 1250 → "1.3k". */
export function formatCompactCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n)
}
