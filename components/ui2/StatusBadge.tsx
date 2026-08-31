import { StatutConvention, StatutPaiement } from '@/lib/ui/types';

type Tone = 'paye' | 'attente' | 'retard' | 'neutre' | 'or';

const TONES: Record<Tone, string> = {
  paye: 'bg-statut-payeBg text-statut-paye',
  attente: 'bg-statut-attenteBg text-statut-attente',
  retard: 'bg-statut-retardBg text-statut-retard',
  neutre: 'bg-statut-neutreBg text-blouin-muted',
  or: 'bg-blouin-goldSoft text-blouin-dark',
};

const CONVENTION: Record<StatutConvention, { label: string; tone: Tone }> = {
  brouillon: { label: 'Brouillon', tone: 'neutre' },
  en_preparation: { label: 'En préparation', tone: 'attente' },
  envoyee: { label: 'Conv. envoyée', tone: 'or' },
  acceptee: { label: 'Acceptée', tone: 'paye' },
  refusee: { label: 'Refusée', tone: 'retard' },
  a_relancer: { label: 'À relancer', tone: 'retard' },
};

const PAIEMENT: Record<StatutPaiement, { label: string; tone: Tone }> = {
  paye: { label: 'Payée', tone: 'paye' },
  partiel: { label: 'Partiellement payé', tone: 'attente' },
  non_paye: { label: 'Non payée', tone: 'attente' },
};

export function StatusBadge({
  convention,
  paiement,
  label,
  tone,
  className = '',
}: {
  convention?: StatutConvention | null;
  paiement?: StatutPaiement | null;
  /** Écrase le libellé déduit — utile pour un status_label venu du SQL */
  label?: string | null;
  tone?: Tone;
  className?: string;
}) {
  const resolved =
    (convention ? CONVENTION[convention] : undefined) ??
    (paiement ? PAIEMENT[paiement] : undefined) ??
    { label: label ?? '—', tone: 'neutre' as Tone };

  const finalTone = tone ?? resolved.tone;
  const finalLabel = label ?? resolved.label;

  if (!convention && !paiement && !label) {
    return <span className="text-blouin-muted text-sm">—</span>;
  }

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-sm px-2 py-1 text-xs font-semibold ${TONES[finalTone]} ${className}`}
    >
      {finalLabel}
    </span>
  );
}
