'use client';

import { ReactNode, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  /** Rendu de la cellule */
  cell: (row: T) => ReactNode;
  /** Valeur de tri ; colonne non triable si absent */
  sortValue?: (row: T) => string | number | null;
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

export type Densite = 'compacte' | 'confort';

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  onRowClick,
  selectedKey,
  densite = 'confort',
  pageSize = 12,
  total,
  emptyLabel = 'Aucun résultat',
  footerLabel,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedKey?: string | null;
  densite?: Densite;
  pageSize?: number;
  /** Nombre total côté serveur, si la pagination n'est pas cliente */
  total?: number;
  emptyLabel?: string;
  footerLabel?: (from: number, to: number, total: number) => string;
}) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (va === null) return 1;
      if (vb === null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * factor;
      return String(va).localeCompare(String(vb), 'fr-CA') * factor;
    });
  }, [rows, columns, sort]);

  const count = total ?? sorted.length;
  const pages = Math.max(Math.ceil(count / pageSize), 1);
  const current = Math.min(page, pages);
  const paginated = total ? sorted : sorted.slice((current - 1) * pageSize, current * pageSize);
  const from = count === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, count);

  const cellPad = densite === 'compacte' ? 'px-4 py-2' : 'px-4 py-3.5';

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  return (
    <div className="border border-blouin-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-blouin-line">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={`${cellPad} ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={`eyebrow inline-flex items-center gap-1 hover:text-blouin-dark focus-ring ${
                        sort?.key === col.key ? 'text-blouin-dark' : ''
                      }`}
                    >
                      {col.header}
                      <ChevronsUpDown size={12} className="shrink-0 opacity-60" />
                    </button>
                  ) : (
                    <span className="eyebrow">{col.header}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-blouin-muted">
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              paginated.map((row) => {
                const key = rowKey(row);
                const selected = selectedKey === key;
                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`border-b border-blouin-line/70 transition-colors last:border-0 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${selected ? 'bg-blouin-goldSoft/50' : 'hover:bg-blouin-cream'}`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`${cellPad} align-middle ${col.align === 'right' ? 'text-right tnum' : ''} ${
                          col.className ?? ''
                        }`}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {count > pageSize ? (
        <div className="flex items-center justify-between gap-4 border-t border-blouin-line px-4 py-3">
          <p className="text-xs text-blouin-muted">
            {footerLabel ? footerLabel(from, to, count) : `Affichage ${from} à ${to} sur ${count}`}
          </p>
          <div className="flex items-center gap-1">
            <PagerButton disabled={current === 1} onClick={() => setPage(current - 1)} label="Page précédente">
              <ChevronLeft size={14} />
            </PagerButton>
            {pageWindow(current, pages).map((p, i) =>
              p === null ? (
                <span key={`gap-${i}`} className="px-1 text-xs text-blouin-muted">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`focus-ring h-7 min-w-7 px-2 text-xs font-semibold transition-colors ${
                    p === current
                      ? 'bg-blouin-dark text-white'
                      : 'text-blouin-dark hover:bg-blouin-cream'
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <PagerButton disabled={current === pages} onClick={() => setPage(current + 1)} label="Page suivante">
              <ChevronRight size={14} />
            </PagerButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PagerButton({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="focus-ring flex h-7 w-7 items-center justify-center text-blouin-dark transition-colors hover:bg-blouin-cream disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function pageWindow(current: number, pages: number): (number | null)[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, null, pages];
  if (current >= pages - 2) return [1, null, pages - 2, pages - 1, pages];
  return [1, null, current, null, pages];
}
