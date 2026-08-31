import { JournalEntry } from '@/lib/ui/types';
import { longDate } from '@/lib/ui/format';

/**
 * Journal chronologique : pastille dorée + filet vertical, libellé, puis date · auteur.
 * Le plus récent en haut.
 */
export function ActivityJournal({
  entries,
  title = 'Journal',
  emptyLabel = 'Aucune activité',
}: {
  entries: JournalEntry[];
  title?: string;
  emptyLabel?: string;
}) {
  return (
    <section className="border border-blouin-line bg-white p-5">
      <h3 className="eyebrow">{title}</h3>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-blouin-muted">{emptyLabel}</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {entries.map((entry, i) => (
            <li key={entry.id} className="relative flex gap-3 pb-0.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blouin-gold" aria-hidden />
              {i < entries.length - 1 ? (
                <span
                  className="absolute left-[3px] top-4 h-[calc(100%+0.5rem)] w-px bg-blouin-line"
                  aria-hidden
                />
              ) : null}
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-blouin-dark">{entry.libelle}</p>
                <p className="mt-0.5 text-xs text-blouin-muted">
                  {[longDate(entry.date), entry.heure, entry.auteur].filter(Boolean).join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
