/** Pure helpers for the composable card. No Angular, easy to unit test. */

/** "Ada Lovelace" → "AL", "ada.lovelace" → "AL", "Ngozi" → "N", "" → "" */
export function initialsOf(name: string | null | undefined): string {
  const words = (name ?? '')
    .trim()
    .split(/[\s._-]+/)
    .filter((w) => /\p{L}|\d/u.test(w));
  return words
    .slice(0, 2)
    .map((w) => [...w][0].toUpperCase())
    .join('');
}

export interface AmountFormat {
  currency?: string;
  locale?: string;
  /** Prefix "+" for money in and "−" for money out */
  signed?: boolean;
}

/**
 * 25000 → "+₦25,000.00", -4500.5 → "−₦4,500.50" (true minus sign).
 * Falls back to a plain number if the currency code is invalid.
 */
export function formatAmount(value: number, { currency = 'NGN', locale, signed = true }: AmountFormat = {}): string {
  let text: string;
  try {
    // narrowSymbol: "₦" in every locale (not "NGN" outside Nigeria)
    text = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    }).format(Math.abs(value));
  } catch {
    text = new Intl.NumberFormat(locale, { minimumFractionDigits: 2 }).format(Math.abs(value));
  }
  if (!signed || value === 0) return value < 0 ? `−${text}` : text;
  return `${value > 0 ? '+' : '−'}${text}`;
}

/**
 * <verben-card>'s `pd` → [vertical, horizontal], read like CSS padding:
 * "16px" → ['16px', '16px'], "50px 30px" → ['50px', '30px'], 12 → ['12px', '12px'].
 * With 3 or 4 values the top and right ones are used. Empty → null (the card's own spacing).
 */
export function toPadding(value: string | number | null | undefined): [string, string] | null {
  if (typeof value === 'number') return [`${value}px`, `${value}px`];
  const [y, x = y] = (value ?? '').trim().split(/\s+/).filter(Boolean);
  return y ? [y, x] : null;
}

/** "16:9", "16/9" or "1" → a CSS aspect-ratio value ("16 / 9"); anything else → null */
export function toAspectRatio(ratio: string | number | null | undefined): string | null {
  if (ratio == null || ratio === '') return null;
  const m = /^\s*(\d+(?:\.\d+)?)\s*(?:[:/]\s*(\d+(?:\.\d+)?))?\s*$/.exec(String(ratio));
  return m ? `${m[1]} / ${m[2] ?? 1}` : null;
}
