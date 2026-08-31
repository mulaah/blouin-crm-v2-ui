/**
 * View models consommés par components/ui2 et les écrans app/internal.
 * Aucun composant ne lit une ligne SQL directement : la conversion vit dans adapters.ts.
 */

export type StatutConvention =
  | 'brouillon'
  | 'en_preparation'
  | 'envoyee'
  | 'acceptee'
  | 'refusee'
  | 'a_relancer';

export type StatutPaiement = 'paye' | 'partiel' | 'non_paye';

export interface ProspectRow {
  id: string;
  numero: string;             // P-2024-0188
  nom: string;                // Sylvie Tremblay
  programme: string | null;   // 1 adulte · 2 enfants
  avocate: string | null;     // M.-C. Blouin
  nbConsultations: number | null;
  montantHt: number | null;
  statutConvention: StatutConvention | null;
}

export interface ProspectsSummary {
  actifs: number | null;
  sansConvention: number | null;
  aRelancer: number | null;
  valeurEnCours: number | null;
  actifsDelta?: string | null;      // « +12 cette semaine »
  sansConventionNote?: string | null;
  aRelancerNote?: string | null;
  valeurNote?: string | null;
  derniereMaj?: string | null;
}

export interface ProspectIdentite {
  id: string;
  numero: string;
  nom: string;
  telephone: string | null;
  courriel: string | null;
  adresse: string | null;
  ville: string | null;
  programme: string | null;
  categorie: string | null;
  avocate: string | null;
  technicienne: string | null;
}

export interface Versement {
  id: string;
  numero: number;
  total: number;
  statut: StatutPaiement;
  echeance: string | null;
  datePaiement: string | null;
  montantHt: number | null;
  montantTtc: number | null;
  montantRecu: number | null;
}

export interface ConventionDetailVM {
  id: string;
  numero: string;                 // C-2024-0188
  dossier: string | null;         // D-4471
  prospect: ProspectIdentite;
  statut: StatutConvention | null;
  statutLabel: string | null;
  programme: string | null;
  typeDossier: string | null;
  categorie: string | null;
  optionConsultation: string | null;
  dateCreation: string | null;
  dateSignature: string | null;
  montantHt: number | null;
  montantTps: number | null;
  montantTvq: number | null;
  montantTtc: number | null;
  encaisse: number | null;
  soldeDu: number | null;
  prochaineEcheance: string | null;
  versements: Versement[];
  journal: JournalEntry[];
}

export interface ConsultationVM {
  id: string;
  rang: number;                   // « Consultation #6 »
  date: string | null;
  heure: string | null;
  type: string | null;
  duree: string | number | null;
  montantHt: number | null;
  avocate: string | null;
  statut: StatutPaiement;
  statutLabel: string | null;
  notes: string | null;
}

export interface ConsultationsVM {
  prospect: ProspectIdentite;
  consultations: ConsultationVM[];
  totalFactureHt: number | null;
  nonPaye: number | null;
  nbNonPayees: number;
  tempsFactureMinutes: number | null;
  nbAvocates: number;
  prochainRdv: { date: string; heure: string | null; objet: string | null; duree: string | null; avocate: string | null } | null;
  repartitionAvocates: { nom: string; nb: number }[];
}

export interface JournalEntry {
  id: string;
  libelle: string;
  date: string | null;
  heure: string | null;
  auteur: string | null;
}
