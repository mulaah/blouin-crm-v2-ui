'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * Volet de détail à droite de la liste (2a) : traiter un dossier sans quitter le tableau.
 * Colonne fixe en ≥ lg, tiroir plein écran en dessous.
 */
export function SidePanel({
  open,
  onClose,
  eyebrow,
  title,
  subtitle,
  badge,
  actions,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-blouin-dark/40 lg:hidden"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-blouin-line bg-white lg:static lg:z-auto lg:max-w-none lg:border lg:border-blouin-line"
        aria-label={title}
      >
        <header className="flex items-start gap-3 border-b border-blouin-line px-5 py-4">
          <div className="min-w-0 flex-1">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 className="mt-1 font-poppins text-lg font-bold leading-tight text-blouin-dark">{title}</h2>
            {subtitle ? <p className="mt-1 text-xs text-blouin-muted">{subtitle}</p> : null}
          </div>
          {badge}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le volet"
            className="focus-ring -mr-1 flex h-7 w-7 items-center justify-center text-blouin-muted transition-colors hover:bg-blouin-cream hover:text-blouin-dark"
          >
            <X size={16} />
          </button>
        </header>

        {actions ? (
          <div className="flex flex-wrap gap-2 border-b border-blouin-line px-5 py-3">{actions}</div>
        ) : null}

        <div className="flex-1 px-5 py-4">{children}</div>
      </aside>
    </>
  );
}

/** Paire étiquette / valeur, en colonne (volet) ou en grille (fiche). */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-dashed border-blouin-line py-2.5 last:border-0">
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm text-blouin-dark">{children ?? '—'}</p>
    </div>
  );
}
