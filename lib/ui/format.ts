export function money(value: number | string | null | undefined, opts?: { cents?: boolean }): string {
  if (value === null || value === undefined || value === '') return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '—';
  const cents = opts?.cents ?? true;
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);
}

export function int(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const n = typeof value === 'string' ? parseInt(value, 10) : value;
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('fr-CA').format(n);
}

export function percent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${Math.round(value)} %`;
}

/** 28-08-2026 — format court des planches */
export function shortDate(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return '—';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}`;
}

/** 28 août 2026 */
export function longDate(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return '—';
  return new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

/** 14 h 30 — convention typographique québécoise */
export function heure(value: string | null | undefined): string {
  if (!value) return '—';
  const m = value.match(/^(\d{1,2})[:h]?(\d{2})?/);
  if (!m) return value;
  const h = parseInt(m[1], 10);
  const min = m[2] ?? '00';
  return `${h} h ${min}`;
}

export function duree(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return value >= 60 ? `${value / 60} heure${value >= 120 ? 's' : ''}` : `${value} minutes`;
  if (value === '30mn' || value === '30min') return '30 minutes';
  if (value === '1h' || value === '1 heure') return '1 heure';
  return value;
}

export function initials(first?: string | null, last?: string | null): string {
  return `${(first ?? '').charAt(0)}${(last ?? '').charAt(0)}`.toUpperCase() || '—';
}

export function fullName(first?: string | null, last?: string | null): string {
  const s = [first, last].filter(Boolean).join(' ').trim();
  return s || '—';
}

/** « M.-C. Blouin » — forme abrégée utilisée dans les colonnes serrées */
export function shortName(first?: string | null, last?: string | null): string {
  if (!first && !last) return '—';
  const ini = (first ?? '')
    .split('-')
    .filter(Boolean)
    .map((p) => `${p.charAt(0).toUpperCase()}.`)
    .join('-');
  return [ini, last].filter(Boolean).join(' ');
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
