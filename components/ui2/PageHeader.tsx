import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function PageHeader({
  breadcrumbs,
  title,
  meta,
  badge,
  actions,
}: {
  breadcrumbs?: { label: string; href?: string }[];
  title: string;
  /** Ligne de métadonnées sous le titre, séparée par des points médians */
  meta?: (string | null | undefined)[];
  badge?: ReactNode;
  actions?: ReactNode;
}) {
  const metaItems = (meta ?? []).filter(Boolean) as string[];

  return (
    <header className="mb-6">
      {breadcrumbs?.length ? (
        <nav aria-label="Fil d'Ariane" className="mb-3 flex items-center gap-1 text-xs text-blouin-muted">
          {breadcrumbs.map((b, i) => (
            <span key={`${b.label}-${i}`} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight size={12} className="opacity-60" /> : null}
              {b.href ? (
                <Link href={b.href} className="focus-ring transition-colors hover:text-blouin-dark">
                  {b.label}
                </Link>
              ) : (
                <span className="text-blouin-dark">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-poppins text-3xl font-bold leading-tight tracking-tight text-blouin-dark">
            {title}
          </h1>
          {metaItems.length || badge ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {metaItems.length ? (
                <p className="text-sm text-blouin-muted">{metaItems.join(' · ')}</p>
              ) : null}
              {badge}
            </div>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
