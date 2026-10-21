const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats "YYYY", "YYYY-MM" or "YYYY-MM-DD" without guessing missing parts. */
export function formatDate(value: string, style: 'full' | 'day' | 'month' = 'full'): string {
  const [y, m, d] = value.split('-');
  if (!m) return y;
  const month = MONTHS[Number(m) - 1] ?? m;
  if (!d || style === 'month') return `${month} ${y}`;
  if (style === 'day') return `${month} ${Number(d)}`;
  return `${month} ${Number(d)}, ${y}`;
}
