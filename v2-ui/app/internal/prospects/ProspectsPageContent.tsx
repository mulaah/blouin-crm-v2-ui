'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, Plus, Phone, CalendarPlus, FileText } from 'lucide-react';

import { PageHeader } from '@/components/ui2/PageHeader';
import { KpiBand } from '@/components/ui2/KpiBand';
import { FilterBar } from '@/components/ui2/FilterBar';
import { Column, DataTable, Densite } from '@/components/ui2/DataTable';
import { StatusBadge } from '@/components/ui2/StatusBadge';
import { SidePanel, Field } from '@/components/ui2/SidePanel';
import { Button } from '@/components/ui2/Button';
import { ActivityJournal } from '@/components/ui2/ActivityJournal';
import { JournalEntry, ProspectRow, ProspectsSummary } from '@/lib/ui/types';
import { int, money } from '@/lib/ui/format';

/**
 * 2a — Accueil Prospects. /internal/prospects
 *
 * Composant présentationnel : la page (page.tsx) charge et adapte les données,
 * puis les passe ici. Aucun fetch à l'intérieur.
 */
export function ProspectsPageContent({
  rows,
  summary,
  journal = [],
  total,
  onExport,
  onCreate,
}: {
  rows: ProspectRow[];
  summary: ProspectsSummary;
  /** Fil d'activité du prospect sélectionné, si tu le charges à la sélection */
  journal?: JournalEntry[];
  total?: number;
  onExport?: () => void;
  onCreate?: () => void;
}) {
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState('tous');
  const [programme, setProgramme] = useState('tous');
  const [avocate, setAvocate] = useState('toutes');
  const [densite, setDensite] = useState<Densite>('confort');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const programmes = useMemo(() => uniq(rows.map((r) => r.programme)), [rows]);
  const avocates = useMemo(() => uniq(rows.map((r) => r.avocate)), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !`${r.nom} ${r.numero} ${r.avocate ?? ''}`.toLowerCase().includes(q)) return false;
      if (programme !== 'tous' && r.programme !== programme) return false;
      if (avocate !== 'toutes' && r.avocate !== avocate) return false;
      if (chip === 'relancer' && r.statutConvention !== 'a_relancer') return false;
      if (chip === 'sans_convention' && r.statutConvention !== null) return false;
      return true;
    });
  }, [rows, search, programme, avocate, chip]);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  const columns: Column<ProspectRow>[] = [
    {
      key: 'prospect',
      header: 'Prospect',
      sortValue: (r) => r.nom,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-blouin-dark">{r.nom}</p>
          <p className="mt-0.5 font-mono text-[11px] text-blouin-muted">{r.numero}</p>
        </div>
      ),
    },
    {
      key: 'programme',
      header: 'Programme',
      sortValue: (r) => r.programme,
      cell: (r) => <span className="text-blouin-dark">{r.programme ?? '—'}</span>,
    },
    {
      key: 'avocate',
      header: 'Avocate',
      sortValue: (r) => r.avocate,
      cell: (r) => <span className="text-blouin-dark">{r.avocate ?? '—'}</span>,
    },
    {
      key: 'consultations',
      header: 'Consult.',
      align: 'right',
      width: '90px',
      sortValue: (r) => r.nbConsultations,
      cell: (r) => <span className="text-blouin-dark">{int(r.nbConsultations)}</span>,
    },
    {
      key: 'montant',
      header: 'Montant HT',
      align: 'right',
      width: '130px',
      sortValue: (r) => r.montantHt,
      cell: (r) => <span className="font-medium text-blouin-dark">{money(r.montantHt)}</span>,
    },
    {
      key: 'statut',
      header: 'Statut convention',
      width: '150px',
      sortValue: (r) => r.statutConvention,
      cell: (r) => <StatusBadge convention={r.statutConvention} />,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-5 p-6 lg:p-8">
      <PageHeader
        title="Prospects"
        meta={[
          summary.actifs !== null ? `${int(summary.actifs)} dossiers actifs` : null,
          summary.derniereMaj,
        ]}
        actions={
          <>
            <Button variant="ghost" icon={<Download size={14} />} onClick={onExport}>
              Exporter
            </Button>
            <Button variant="primary" icon={<Plus size={14} />} onClick={onCreate}>
              Nouveau prospect
            </Button>
          </>
        }
      />

      <KpiBand
        items={[
          {
            label: 'Prospects actifs',
            value: int(summary.actifs),
            delta: summary.actifsDelta,
            note: summary.actifsDelta ? null : 'cette semaine',
          },
          { label: 'Sans convention', value: int(summary.sansConvention), note: summary.sansConventionNote },
          { label: 'À relancer', value: int(summary.aRelancer), note: summary.aRelancerNote },
          { label: 'Valeur en cours', value: money(summary.valeurEnCours, { cents: false }), note: summary.valeurNote },
        ]}
      />

      <FilterBar
        search={search}
        onSearch={setSearch}
        chips={[
          { id: 'tous', label: 'Tous', count: rows.length },
          { id: 'relancer', label: 'À relancer', count: summary.aRelancer },
          { id: 'sans_convention', label: 'Sans convention', count: summary.sansConvention },
        ]}
        activeChip={chip}
        onChipChange={setChip}
        selects={[
          {
            id: 'programme',
            label: 'Programme : tous',
            value: programme,
            onChange: setProgramme,
            options: [{ value: 'tous', label: 'tous' }, ...programmes.map((p) => ({ value: p, label: p }))],
          },
          {
            id: 'avocate',
            label: 'Avocate : toutes',
            value: avocate,
            onChange: setAvocate,
            options: [{ value: 'toutes', label: 'toutes' }, ...avocates.map((a) => ({ value: a, label: a }))],
          },
        ]}
        densite={densite}
        onDensiteChange={setDensite}
      />

      <div className={`grid min-h-0 flex-1 gap-5 ${selected ? 'lg:grid-cols-[minmax(0,1fr)_360px]' : ''}`}>
        <DataTable
          rows={filtered}
          columns={columns}
          rowKey={(r) => r.id}
          densite={densite}
          onRowClick={(r) => setSelectedId(r.id)}
          selectedKey={selectedId}
          total={total}
          emptyLabel="Aucun prospect ne correspond à ces filtres"
          footerLabel={(from, to, count) => `Affichage ${from} à ${to} sur ${count} prospects`}
        />

        <SidePanel
          open={!!selected}
          onClose={() => setSelectedId(null)}
          eyebrow={selected ? `Prospect · ${selected.numero}` : null}
          title={selected?.nom ?? ''}
          subtitle={selected?.programme}
          badge={<StatusBadge convention={selected?.statutConvention ?? null} />}
          actions={
            <>
              <Button variant="gold" icon={<Phone size={14} />}>
                Appeler
              </Button>
              <Button variant="peach" icon={<CalendarPlus size={14} />}>
                Consultation
              </Button>
              <Button variant="primary" icon={<FileText size={14} />}>
                Facture
              </Button>
            </>
          }
        >
          {selected ? (
            <div className="space-y-5">
              <div>
                <Field label="Programme">{selected.programme ?? '—'}</Field>
                <Field label="Avocate assignée">{selected.avocate ?? '—'}</Field>
                <Field label="Consultations">{int(selected.nbConsultations)}</Field>
                <Field label="Montant HT">{money(selected.montantHt)}</Field>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/internal/consultations/${selected.id}`}
                  className="focus-ring border border-blouin-line px-3 py-2 text-xs font-semibold text-blouin-dark transition-colors hover:bg-blouin-cream"
                >
                  Consultations
                </Link>
                <Link
                  href={`/internal/prospects/${selected.id}`}
                  className="focus-ring border border-blouin-line px-3 py-2 text-xs font-semibold text-blouin-dark transition-colors hover:bg-blouin-cream"
                >
                  Ouvrir la fiche
                </Link>
              </div>

              {journal.length ? <ActivityJournal entries={journal} title="Fil d'activité" /> : null}
            </div>
          ) : null}
        </SidePanel>
      </div>
    </div>
  );
}

function uniq(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, 'fr-CA'));
}
