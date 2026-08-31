'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Receipt, Pencil } from 'lucide-react';

import { PageHeader } from '@/components/ui2/PageHeader';
import { KpiBand } from '@/components/ui2/KpiBand';
import { StatusBadge } from '@/components/ui2/StatusBadge';
import { Field } from '@/components/ui2/SidePanel';
import { Button } from '@/components/ui2/Button';
import { ConsultationsVM, ConsultationVM } from '@/lib/ui/types';
import { duree, heure, longDate, money, shortDate } from '@/lib/ui/format';

type Onglet = 'toutes' | 'non_payees' | 'a_venir';
type Tri = 'recentes' | 'anciennes';

/**
 * 2c — Consultations d'un prospect. /internal/consultations/[prospect_id]
 * Liste de fiches (une par consultation) + colonne latérale : identité, prochain
 * rendez-vous, répartition par avocate.
 */
export function ConsultationsView({
  data,
  onNouvelle,
  onFacturerImpayees,
  onModifier,
  onFacturer,
  onConfirmerRdv,
  onReporterRdv,
}: {
  data: ConsultationsVM;
  onNouvelle?: () => void;
  onFacturerImpayees?: () => void;
  onModifier?: (c: ConsultationVM) => void;
  onFacturer?: (c: ConsultationVM) => void;
  onConfirmerRdv?: () => void;
  onReporterRdv?: () => void;
}) {
  const [onglet, setOnglet] = useState<Onglet>('toutes');
  const [tri, setTri] = useState<Tri>('recentes');
  const { prospect } = data;

  const aVenir = useMemo(
    () => data.consultations.filter((c) => c.date && new Date(c.date).getTime() > Date.now()),
    [data.consultations]
  );

  const liste = useMemo(() => {
    const base =
      onglet === 'non_payees'
        ? data.consultations.filter((c) => c.statut !== 'paye')
        : onglet === 'a_venir'
        ? aVenir
        : data.consultations;

    return [...base].sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return tri === 'recentes' ? tb - ta : ta - tb;
    });
  }, [data.consultations, aVenir, onglet, tri]);

  const heures = data.tempsFactureMinutes;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        breadcrumbs={[{ label: 'Consultations', href: '/internal/consultations' }, { label: prospect.nom }]}
        title={`${prospect.nom} — ${data.consultations.length} consultation${data.consultations.length > 1 ? 's' : ''}`}
        meta={[prospect.numero, prospect.programme, prospect.ville, prospect.telephone]}
        actions={
          <>
            <Button variant="ghost" icon={<Receipt size={14} />} onClick={onFacturerImpayees}>
              Facturer les impayées
            </Button>
            <Button variant="primary" icon={<Plus size={14} />} onClick={onNouvelle}>
              Nouvelle consultation
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <KpiBand
            items={[
              {
                label: 'Total facturé HT',
                value: money(data.totalFactureHt),
                note: `${data.consultations.length} consultations`,
              },
              {
                label: 'Non payé',
                value: money(data.nonPaye),
                note: `${data.nbNonPayees} consultation${data.nbNonPayees > 1 ? 's' : ''}`,
              },
              {
                label: 'Temps facturé',
                value: heures !== null ? `${Math.floor(heures / 60)} h ${String(heures % 60).padStart(2, '0')}` : '—',
                note: `${data.nbAvocates} avocate${data.nbAvocates > 1 ? 's' : ''} impliquée${data.nbAvocates > 1 ? 's' : ''}`,
              },
            ]}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  { id: 'toutes' as Onglet, label: 'Toutes', count: data.consultations.length },
                  { id: 'non_payees' as Onglet, label: 'Non payées', count: data.nbNonPayees },
                  { id: 'a_venir' as Onglet, label: 'À venir', count: aVenir.length },
                ]
              ).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOnglet(o.id)}
                  className={`focus-ring px-3 py-1.5 text-xs font-semibold transition-colors ${
                    onglet === o.id
                      ? 'bg-blouin-dark text-white'
                      : 'border border-blouin-line bg-white text-blouin-dark hover:bg-blouin-cream'
                  }`}
                >
                  {o.label} · {o.count}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTri((t) => (t === 'recentes' ? 'anciennes' : 'recentes'))}
              className="focus-ring text-xs font-semibold text-blouin-goldDark hover:text-blouin-dark"
            >
              Trier : {tri === 'recentes' ? 'plus récentes' : 'plus anciennes'}
            </button>
          </div>

          {liste.length === 0 ? (
            <p className="border border-blouin-line bg-white px-5 py-10 text-center text-sm text-blouin-muted">
              Aucune consultation
            </p>
          ) : (
            <ul className="space-y-4">
              {liste.map((c) => (
                <li key={c.id}>
                  <ConsultationCard
                    consultation={c}
                    onModifier={onModifier ? () => onModifier(c) : undefined}
                    onFacturer={onFacturer ? () => onFacturer(c) : undefined}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-5">
          <section className="border border-blouin-line bg-white p-5">
            <h2 className="eyebrow">Informations prospect</h2>
            <div className="mt-3">
              <Field label="Téléphone">{prospect.telephone ?? '—'}</Field>
              <Field label="Courriel">{prospect.courriel ?? '—'}</Field>
              <Field label="Adresse">{prospect.adresse ?? '—'}</Field>
              <Field label="Avocate assignée">{prospect.avocate ?? '—'}</Field>
              <Field label="Technicienne">{prospect.technicienne ?? '—'}</Field>
            </div>
            {prospect.id ? (
              <Link
                href={`/internal/prospects/${prospect.id}`}
                className="focus-ring mt-4 block bg-blouin-dark px-3.5 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-blouin-darkHover"
              >
                Ouvrir la fiche prospect
              </Link>
            ) : null}
          </section>

          {data.prochainRdv ? (
            <section className="zellige-dark border border-blouin-dark p-5 text-white">
              <h2 className="eyebrow text-blouin-gold">Prochain rendez-vous</h2>
              <p className="mt-2 font-poppins text-xl font-bold leading-tight">
                {longDate(data.prochainRdv.date)}
                {data.prochainRdv.heure ? `, ${heure(data.prochainRdv.heure)}` : ''}
              </p>
              <p className="mt-1 text-xs text-white/70">
                {[data.prochainRdv.objet, data.prochainRdv.duree, data.prochainRdv.avocate]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="gold" onClick={onConfirmerRdv}>
                  Confirmer
                </Button>
                <Button
                  variant="ghost"
                  onClick={onReporterRdv}
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  Reporter
                </Button>
              </div>
            </section>
          ) : null}

          {data.repartitionAvocates.length ? (
            <section className="border border-blouin-line bg-white p-5">
              <h2 className="eyebrow">Répartition par avocate</h2>
              <ul className="mt-3 space-y-3">
                {data.repartitionAvocates.map((a) => {
                  const max = data.repartitionAvocates[0].nb || 1;
                  return (
                    <li key={a.nom}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-sm text-blouin-dark">{a.nom}</span>
                        <span className="tnum text-sm font-semibold text-blouin-dark">{a.nb}</span>
                      </div>
                      <div className="mt-1.5 h-1 bg-blouin-line">
                        <div
                          className="h-full bg-blouin-gold"
                          style={{ width: `${(a.nb / max) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function ConsultationCard({
  consultation: c,
  onModifier,
  onFacturer,
}: {
  consultation: ConsultationVM;
  onModifier?: () => void;
  onFacturer?: () => void;
}) {
  return (
    <article className="border border-blouin-line bg-white">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-blouin-line px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-poppins text-base font-bold text-blouin-dark">Consultation #{c.rang}</h3>
            <StatusBadge paiement={c.statut} label={c.statutLabel ?? undefined} />
          </div>
          <p className="mt-1 font-mono text-[11px] text-blouin-muted">
            {shortDate(c.date)}
            {c.heure ? ` à ${heure(c.heure)}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {onModifier ? (
            <Button variant="ghost" icon={<Pencil size={13} />} onClick={onModifier}>
              Modifier
            </Button>
          ) : null}
          {onFacturer ? (
            <Button variant="peach" icon={<Receipt size={13} />} onClick={onFacturer}>
              Facture
            </Button>
          ) : null}
        </div>
      </header>

      <div className="grid gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-4">
        <Cellule label="Type">{c.type ?? '—'}</Cellule>
        <Cellule label="Durée">{duree(c.duree)}</Cellule>
        <Cellule label="Montant HT">{money(c.montantHt)}</Cellule>
        <Cellule label="Avocate">{c.avocate ?? '—'}</Cellule>
      </div>

      {c.notes ? (
        <div className="border-t border-blouin-line bg-blouin-cream px-5 py-4">
          <p className="eyebrow">Notes de l'avocate</p>
          <p className="mt-1.5 text-sm leading-relaxed text-blouin-dark">{c.notes}</p>
        </div>
      ) : null}
    </article>
  );
}

function Cellule({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm text-blouin-dark">{children}</p>
    </div>
  );
}
