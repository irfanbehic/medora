export function formatRating(rating: number | null | undefined): string {
  if (rating == null || Number.isNaN(rating)) return '—';
  return rating.toFixed(1);
}

export function formatCount(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '0';
  if (value < 1000) return String(value);
  if (value < 10000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  if (value < 1_000_000) return `${Math.round(value / 1000)}k`;
  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

export function formatLocation(
  city: string | null | undefined,
  countryName: string | null | undefined,
): string {
  return [city, countryName].filter(Boolean).join(', ');
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const cleaned = name.replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Short, locale-aware review date, e.g. "May 12, 2026". */
export function formatDate(iso: string, locale = 'en'): string {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}
