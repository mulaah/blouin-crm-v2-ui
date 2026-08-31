import { ReactNode } from 'react';

export interface Kpi {
  label: string;
  value: ReactNode;
  note?: string | null;
  /** « +12 », « 9 à signer » — posé à droite de la valeur, en doré */
  delta?: string | null;
}

// Classes littérales : Tailwind ne sait pas scanner une classe construite à l'exécution.
const COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

/**
 * Bandeau de chiffres clés. Cellules d'égale largeur séparées par un filet vertical,
 * comme sur les planches 2a / 2b / 2c.
 */
export function KpiBand({ items, className = '' }: { items: Kpi[]; className?: string }) {
  const cols = COLS[Math.min(items.length, 5)] ?? 'lg:grid-cols-4';

  return (
    <div
      className={`grid divide-y divide-blouin-line border border-blouin-line bg-white sm:grid-cols-2 sm:divide-y-0 lg:divide-x ${cols} ${className}`}
    >
      {items.map((kpi) => (
        <div key={kpi.label} className="px-5 py-4">
          <p className="eyebrow">{kpi.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="tnum font-poppins text-2xl font-bold text-blouin-dark">{kpi.value}</span>
            {kpi.delta ? (
              <span className="text-xs font-semibold text-blouin-goldDark">{kpi.delta}</span>
            ) : null}
          </div>
          {kpi.note ? <p className="mt-2 text-xs text-blouin-muted">{kpi.note}</p> : null}
        </div>
      ))}
    </div>
  );
}

/** Variante encadrée pour un chiffre isolé (colonne de droite, mobile). */
export function KpiCard({ label, value, note }: Kpi) {
  return (
    <div className="border border-blouin-line bg-white px-4 py-3">
      <p className="eyebrow">{label}</p>
      <p className="tnum mt-1 font-poppins text-xl font-bold text-blouin-dark">{value}</p>
      {note ? <p className="mt-1 text-xs text-blouin-muted">{note}</p> : null}
    </div>
  );
}
