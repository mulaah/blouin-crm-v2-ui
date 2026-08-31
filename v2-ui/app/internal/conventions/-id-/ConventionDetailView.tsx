'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Send, CheckCircle2, Plus } from 'lucide-react';

import { PageHeader } from '@/components/ui2/PageHeader';
import { KpiBand } from '@/components/ui2/KpiBand';
import { Tabs } from '@/components/ui2/Tabs';
import { StatusBadge } from '@/components/ui2/StatusBadge';
import { Field } from '@/components/ui2/SidePanel';
import { Button } from '@/components/ui2/Button';
import { ActivityJournal } from '@/components/ui2/ActivityJournal';
import { ConventionDetailVM, Versement } from '@/lib/ui/types';
import { money, percent, shortDate } from '@/lib/ui/format';

/**
 * 2b — Détail d'une convention. /internal/conventions/[id]
 * Deux colonnes : contenu à gauche, identité du prospect + taxes + journal à droite.
 */
export function ConventionDetailView({
  convention,
  onTelecharger,
  onRelancer,
  onMarquerSignee,
  onEnregistrerPaiement,
}: {
  convention: ConventionDetailVM;
  onTelecharger?: () => void;
  onRelancer?: () => void;
  onMarquerSignee?: () => void;
  onEnregistrerPaiement?: () => void;
}) {
  const [tab, setTab] = useState('infos');
  const c = convention;

  const partEncaissee =
    c.montantTtc && c.encaisse ? (c.encaisse / c.montantTtc) * 100 : null;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        breadcrumbs={[{ label: 'Conventions', href: '/internal/conventions' }, { label: c.numero }]}
        title={`Convention — ${c.prospect.nom}`}
        meta={[c.numero, c.dossier ? `Dossier ${c.dossier}` : null, `Prospect ${c.prospect.numero}`]}
        badge={<StatusBadge convention={c.statut} label={c.statut ? undefined : c.statutLabel} />}
        actions={
          <>
            <Button variant="ghost" icon={<Download size={14} />} onClick={onTelecharger}>
              Télécharger .docx
            </Button>
            <Button variant="gold" icon={<Send size={14} />} onClick={onRelancer}>
              Relancer
            </Button>
            <Button variant="primary" icon={<CheckCircle2 size={14} />} onClick={onMarquerSignee}>
              Marquer signée
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <KpiBand
            items={[
              { label: 'Montant TTC', value: money(c.montantTtc), note: c.montantHt ? `${money(c.montantHt)} HT` : null },
              {
                label: 'Encaissé',
                value: money(c.encaisse),
                note: partEncaissee !== null ? `${percent(partEncaissee)} du total` : null,
              },
              {
                label: 'Solde dû',
                value: money(c.soldeDu),
                note: c.prochaineEcheance ? `prochaine échéance ${shortDate(c.prochaineEcheance)}` : null,
              },
            ]}
          />

          <div>
            <Tabs
              tabs={[
                { id: 'infos', label: 'Informations' },
                { id: 'versements', label: `Versements (${c.versements.length})` },
                { id: 'journal', label: 'Journal' },
              ]}
              active={tab}
              onChange={setTab}
            />

            <div className="mt-5">
              {tab === 'infos' ? (
                <section className="border border-blouin-line bg-white p-5">
                  <h2 className="font-poppins text-base font-bold text-blouin-dark">
                    Informations de la convention
                  </h2>
                  <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
                    <Field label="Statut">{c.statutLabel ?? '—'}</Field>
                    <Field label="Programme">{c.programme ?? '—'}</Field>
                    <Field label="Type de dossier">{c.typeDossier ?? '—'}</Field>
                    <Field label="Catégorie">{c.categorie ?? '—'}</Field>
                    <Field label="Option consultation">{c.optionConsultation ?? '—'}</Field>
                    <Field label="Date de création">{shortDate(c.dateCreation)}</Field>
                    <Field label="Date de signature">
                      {c.dateSignature ? shortDate(c.dateSignature) : 'Non signée'}
                    </Field>
                    <Field label="Technicienne">{c.prospect.technicienne ?? '—'}</Field>
                  </div>
                </section>
              ) : null}

              {tab === 'versements' ? (
                <section className="border border-blouin-line bg-white">
                  <header className="flex items-center justify-between gap-4 border-b border-blouin-line px-5 py-4">
                    <h2 className="font-poppins text-base font-bold text-blouin-dark">Versements</h2>
                    <button
                      type="button"
                      onClick={onEnregistrerPaiement}
                      className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-blouin-goldDark hover:text-blouin-dark"
                    >
                      <Plus size={13} /> Enregistrer un paiement
                    </button>
                  </header>

                  {c.versements.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-blouin-muted">Aucun versement</p>
                  ) : (
                    <ul className="divide-y divide-blouin-line">
                      {c.versements.map((v) => (
                        <li key={v.id}>
                          <VersementRow versement={v} />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : null}

              {tab === 'journal' ? (
                <ActivityJournal entries={c.journal} title="Journal de la convention" />
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <section className="border border-blouin-line bg-white p-5">
            <h2 className="eyebrow">Prospect</h2>
            <p className="mt-2 font-poppins text-base font-bold text-blouin-dark">{c.prospect.nom}</p>
            <p className="font-mono text-[11px] text-blouin-muted">{c.prospect.numero}</p>
            <div className="mt-3">
              <Field label="Téléphone">{c.prospect.telephone ?? '—'}</Field>
              <Field label="Courriel">{c.prospect.courriel ?? '—'}</Field>
              <Field label="Adresse">{c.prospect.adresse ?? '—'}</Field>
              <Field label="Avocate assignée">{c.prospect.avocate ?? '—'}</Field>
              <Field label="Technicienne">{c.prospect.technicienne ?? '—'}</Field>
            </div>
            {c.prospect.id ? (
              <Link
                href={`/internal/prospects/${c.prospect.id}`}
                className="focus-ring mt-4 block bg-blouin-dark px-3.5 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-blouin-darkHover"
              >
                Ouvrir la fiche prospect
              </Link>
            ) : null}
          </section>

          <section className="border border-blouin-line bg-white p-5">
            <h2 className="eyebrow">Détail des taxes</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <LigneTaxe label="Montant HT" value={money(c.montantHt)} />
              <LigneTaxe label="TPS (5 %)" value={money(c.montantTps)} />
              <LigneTaxe label="TVQ (9,975 %)" value={money(c.montantTvq)} />
              <div className="border-t border-blouin-line pt-2">
                <LigneTaxe label="Total TTC" value={money(c.montantTtc)} strong />
              </div>
            </dl>
          </section>

          {c.journal.length ? <ActivityJournal entries={c.journal.slice(0, 5)} /> : null}
        </aside>
      </div>
    </div>
  );
}

function LigneTaxe({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? 'font-semibold text-blouin-dark' : 'text-blouin-muted'}>{label}</dt>
      <dd className={`tnum ${strong ? 'font-bold text-blouin-dark' : 'text-blouin-dark'}`}>{value}</dd>
    </div>
  );
}

function VersementRow({ versement: v }: { versement: Versement }) {
  const note =
    v.statut === 'paye' && v.datePaiement
      ? `Payé le ${shortDate(v.datePaiement)}`
      : v.statut === 'partiel' && v.montantRecu
      ? `${money(v.montantRecu)} reçus`
      : v.echeance
      ? `Échéance ${shortDate(v.echeance)}`
      : null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-blouin-dark">
            Versement {v.numero} / {v.total}
          </p>
          <StatusBadge paiement={v.statut} label={v.statut === 'paye' ? 'Payé' : v.statut === 'partiel' ? 'Partiellement payé' : 'Non payé'} />
        </div>
        <p className="mt-1 text-xs text-blouin-muted">
          {[v.echeance ? `Échéance ${shortDate(v.echeance)}` : null, note].filter(Boolean).join(' · ')}
        </p>
      </div>
      <div className="flex gap-6 text-right">
        <div>
          <p className="eyebrow">HT</p>
          <p className="tnum mt-0.5 text-sm font-medium text-blouin-dark">{money(v.montantHt)}</p>
        </div>
        <div>
          <p className="eyebrow">TTC</p>
          <p className="tnum mt-0.5 text-sm font-medium text-blouin-dark">{money(v.montantTtc)}</p>
        </div>
      </div>
    </div>
  );
}
