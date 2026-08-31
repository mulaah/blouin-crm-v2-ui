import {
  ConsultationsVM,
  ConsultationVM,
  ConventionDetailVM,
  JournalEntry,
  ProspectIdentite,
  ProspectRow,
  ProspectsSummary,
  StatutConvention,
  StatutPaiement,
  Versement,
} from './types';
import { fullName, shortName } from './format';

/**
 * Seul point de contact entre tes réponses API et l'UI.
 * Écrit contre les routes actuelles du dépôt ; si le SQL change, c'est ici que ça se corrige.
 */

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isNaN(n) ? null : n;
};

const str = (v: unknown): string | null => (v === null || v === undefined || v === '' ? null : String(v));

export function statutConvention(code: unknown): StatutConvention | null {
  switch (str(code)) {
    case 'draft':
    case 'brouillon':
      return 'brouillon';
    case 'in_preparation':
      return 'en_preparation';
    case 'sent':
      return 'envoyee';
    case 'accepted':
      return 'acceptee';
    case 'refused':
      return 'refusee';
    case 'to_follow_up':
      return 'a_relancer';
    default:
      return null;
  }
}

export function statutPaiement(code: unknown): StatutPaiement {
  switch (str(code)) {
    case 'paid':
    case 'paye':
      return 'paye';
    case 'partial':
      return 'partiel';
    default:
      return 'non_paye';
  }
}

/** GET /api/internal/prospects -> data[] */
export function toProspectRows(rows: any[]): ProspectRow[] {
  return (rows ?? []).map((r) => ({
    id: String(r.id),
    numero: str(r.prospect_number) ?? '—',
    nom: fullName(r.first_name, r.last_name),
    // program_label vient de lookup_labels ; le foyer (« 1 adulte · 2 enfants ») reste à exposer
    programme: str(r.household_label) ?? str(r.program_label) ?? str(r.program_code),
    avocate: r.avocate_last_name ? shortName(r.avocate_first_name, r.avocate_last_name) : null,
    nbConsultations: num(r.nb_consultations),
    montantHt: num(r.montant_ht),
    statutConvention: statutConvention(r.convention_status),
  }));
}

/** Repli tant que la route ne renvoie pas d'agrégats : calcul côté client sur la page courante. */
export function toProspectsSummary(rows: any[], meta?: Partial<ProspectsSummary>): ProspectsSummary {
  const list = toProspectRows(rows);
  return {
    actifs: meta?.actifs ?? list.length,
    sansConvention: meta?.sansConvention ?? list.filter((p) => p.statutConvention === null).length,
    aRelancer: meta?.aRelancer ?? list.filter((p) => p.statutConvention === 'a_relancer').length,
    valeurEnCours: meta?.valeurEnCours ?? list.reduce((sum, p) => sum + (p.montantHt ?? 0), 0),
    actifsDelta: meta?.actifsDelta ?? null,
    sansConventionNote: meta?.sansConventionNote ?? null,
    aRelancerNote: meta?.aRelancerNote ?? null,
    valeurNote: meta?.valeurNote ?? null,
    derniereMaj: meta?.derniereMaj ?? null,
  };
}

function identiteFromConvention(c: any): ProspectIdentite {
  return {
    id: String(c.prospect_id ?? ''),
    numero: str(c.prospect_number) ?? '—',
    nom: fullName(c.prospect_first_name, c.prospect_last_name),
    telephone: str(c.prospect_phone),
    courriel: str(c.prospect_email),
    adresse: str(c.prospect_address),
    ville: str(c.prospect_city),
    programme: str(c.programme_label) ?? str(c.programme_code),
    categorie: str(c.categorie_label) ?? str(c.categorie_code),
    avocate: c.avocate_last_name ? fullName(c.avocate_first_name, c.avocate_last_name) : null,
    technicienne: c.technicien_last_name ? fullName(c.technicien_first_name, c.technicien_last_name) : null,
  };
}

export function toIdentiteFromProspect(p: any): ProspectIdentite {
  return {
    id: String(p?.id ?? ''),
    numero: str(p?.prospect_number) ?? '—',
    nom: fullName(p?.first_name, p?.last_name),
    telephone: str(p?.phone),
    courriel: str(p?.email),
    adresse: [str(p?.address), str(p?.city)].filter(Boolean).join(', ') || null,
    ville: str(p?.city),
    programme: str(p?.program_label) ?? str(p?.program_code),
    categorie: str(p?.categorie_label),
    avocate: p?.avocate_last_name ? fullName(p.avocate_first_name, p.avocate_last_name) : null,
    technicienne: p?.technicien_last_name ? fullName(p.technicien_first_name, p.technicien_last_name) : null,
  };
}

function toVersements(rows: any[]): Versement[] {
  const total = (rows ?? []).length;
  return (rows ?? []).map((v, i) => ({
    id: String(v.id ?? i),
    numero: Number(v.numero_versement ?? i + 1),
    total,
    statut: statutPaiement(v.statut_paiement),
    echeance: str(v.date_versement),
    datePaiement: str(v.date_paiement),
    montantHt: num(v.montant_ht),
    montantTtc: num(v.montant_ttc),
    montantRecu: num(v.montant_recu),
  }));
}

export function toJournal(rows: any[]): JournalEntry[] {
  return (rows ?? []).map((e, i) => ({
    id: String(e.id ?? i),
    libelle: str(e.label) ?? str(e.description) ?? str(e.action) ?? '—',
    date: str(e.created_at) ?? str(e.date),
    heure: str(e.heure),
    auteur: e.actor_last_name ? shortName(e.actor_first_name, e.actor_last_name) : str(e.actor),
  }));
}

/** GET /api/internal/conventions/[id] -> data { convention, versements } */
export function toConventionDetail(data: any): ConventionDetailVM {
  const c = data?.convention ?? {};
  const versements = toVersements(data?.versements);
  const encaisse = versements.reduce(
    (s, v) => s + (v.statut === 'paye' ? v.montantTtc ?? 0 : v.montantRecu ?? 0),
    0
  );
  const ttc = num(c.montant_ttc);
  const impayes = versements.filter((v) => v.statut !== 'paye');

  return {
    id: String(c.id ?? ''),
    numero: str(c.convention_number) ?? str(c.matter_number) ?? '—',
    dossier: str(c.matter_number),
    prospect: identiteFromConvention(c),
    statut: statutConvention(c.status),
    statutLabel: str(c.status_label),
    programme: str(c.programme_label) ?? str(c.programme_code),
    typeDossier: str(c.type_dossier_label) ?? str(c.type_dossier_code),
    categorie: str(c.categorie_label) ?? str(c.categorie_code),
    optionConsultation: str(c.consultation_option_label) ?? str(c.consultation_option_code),
    dateCreation: str(c.created_at),
    dateSignature: str(c.date_signature),
    montantHt: num(c.montant_ht),
    montantTps: num(c.montant_tps),
    montantTvq: num(c.montant_tvq),
    montantTtc: ttc,
    encaisse: encaisse || null,
    soldeDu: ttc !== null ? Math.max(ttc - encaisse, 0) : null,
    prochaineEcheance: impayes[0]?.echeance ?? null,
    versements,
    journal: toJournal(data?.journal),
  };
}

/** GET /api/internal/consultations/prospect/[prospect_id] -> data { prospect, consultations } */
export function toConsultations(data: any): ConsultationsVM {
  const rows: any[] = data?.consultations ?? [];
  const nb = rows.length;

  const consultations: ConsultationVM[] = rows.map((c, i) => ({
    id: String(c.id ?? i),
    rang: nb - i, // rows triées date décroissante : la première est la plus récente
    date: str(c.date_rdv),
    heure: str(c.heure_rdv),
    type: str(c.type_consultation),
    duree: str(c.duree) ?? num(c.duree_minutes),
    montantHt: num(c.prix_ht),
    avocate: c.avocate_last_name ? fullName(c.avocate_first_name, c.avocate_last_name) : null,
    statut: statutPaiement(c.paiement_statut),
    statutLabel: str(c.paiement_statut_label),
    notes: str(c.notes_avocate),
  }));

  const impayees = consultations.filter((c) => c.statut !== 'paye');
  const avocates = new Map<string, number>();
  consultations.forEach((c) => {
    if (!c.avocate) return;
    avocates.set(c.avocate, (avocates.get(c.avocate) ?? 0) + 1);
  });

  const minutes = rows.reduce((s, c) => {
    const m = num(c.duree_minutes);
    if (m !== null) return s + m;
    return s + (str(c.duree) === '30mn' || str(c.duree) === '30min' ? 30 : 60);
  }, 0);

  const futures = consultations
    .filter((c) => c.date && new Date(c.date).getTime() > Date.now())
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  return {
    prospect: toIdentiteFromProspect(data?.prospect),
    consultations,
    totalFactureHt: consultations.reduce((s, c) => s + (c.montantHt ?? 0), 0) || null,
    nonPaye: impayees.reduce((s, c) => s + (c.montantHt ?? 0), 0) || null,
    nbNonPayees: impayees.length,
    tempsFactureMinutes: minutes || null,
    nbAvocates: avocates.size,
    prochainRdv: futures[0]
      ? {
          date: futures[0].date!,
          heure: futures[0].heure,
          objet: futures[0].type,
          duree: typeof futures[0].duree === 'string' ? futures[0].duree : null,
          avocate: futures[0].avocate,
        }
      : null,
    repartitionAvocates: Array.from(avocates.entries())
      .map(([nom, nb]) => ({ nom, nb }))
      .sort((a, b) => b.nb - a.nb),
  };
}
