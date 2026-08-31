'use client';

import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Densite } from './DataTable';

export interface FilterSelect {
  id: string;
  label: string;              // « Programme : tous »
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export interface FilterChip {
  id: string;
  label: string;              // « À relancer »
  count?: number | null;
}

/**
 * Barre de filtres des écrans liste : recherche, onglets rapides, sélecteurs, densité.
 * Tout est contrôlé — aucun état interne, pour que la page reste maîtresse de ses requêtes.
 */
export function FilterBar({
  search,
  onSearch,
  searchPlaceholder = 'Nom, N° prospect, courriel…',
  chips,
  activeChip,
  onChipChange,
  selects,
  densite,
  onDensiteChange,
  actions,
}: {
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  chips?: FilterChip[];
  activeChip?: string;
  onChipChange?: (id: string) => void;
  selects?: FilterSelect[];
  densite?: Densite;
  onDensiteChange?: (d: Densite) => void;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border border-blouin-line bg-white px-4 py-3">
      <label className="relative min-w-[240px] flex-1">
        <span className="sr-only">{searchPlaceholder}</span>
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blouin-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="focus-ring w-full border border-blouin-line bg-white py-2 pl-9 pr-3 text-sm text-blouin-dark placeholder:text-blouin-muted"
        />
      </label>

      {chips?.length ? (
        <div className="flex flex-wrap items-center gap-1">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onChipChange?.(chip.id)}
              className={`focus-ring px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeChip === chip.id
                  ? 'bg-blouin-dark text-white'
                  : 'border border-blouin-line text-blouin-dark hover:bg-blouin-cream'
              }`}
            >
              {chip.label}
              {chip.count !== null && chip.count !== undefined ? (
                <span className="ml-1.5 opacity-70">· {chip.count}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {selects?.map((sel) => (
        <label key={sel.id} className="relative">
          <span className="sr-only">{sel.label}</span>
          <select
            value={sel.value}
            onChange={(e) => sel.onChange(e.target.value)}
            className="focus-ring border border-blouin-line bg-white py-2 pl-3 pr-8 text-xs font-medium text-blouin-dark"
          >
            {sel.options.map((o) => (
              <option key={o.value} value={o.value}>
                {sel.label.split(' :')[0]} : {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      {densite && onDensiteChange ? (
        <div className="flex border border-blouin-line">
          {(['compacte', 'confort'] as Densite[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDensiteChange(d)}
              className={`focus-ring px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                densite === d ? 'bg-blouin-goldSoft text-blouin-dark' : 'text-blouin-muted hover:bg-blouin-cream'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      ) : null}

      {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
