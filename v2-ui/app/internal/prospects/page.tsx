'use client';

import { useEffect, useState } from 'react';
import { ProspectsPageContent } from './ProspectsPageContent';
import { toProspectRows, toProspectsSummary } from '@/lib/ui/adapters';
import { ProspectRow, ProspectsSummary } from '@/lib/ui/types';

/**
 * Chargement des données — le seul endroit qui parle à l'API.
 * Passe en server component si tu préfères : ProspectsPageContent reste inchangé.
 */
export default function ProspectsPage() {
  const [rows, setRows] = useState<ProspectRow[]>([]);
  const [summary, setSummary] = useState<ProspectsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/internal/prospects');
        if (!res.ok) throw new Error('Chargement des prospects impossible');
        const json = await res.json();
        if (annule) return;
        setRows(toProspectRows(json.data));
        setSummary(toProspectsSummary(json.data, { actifs: json.count }));
      } catch (e: any) {
        if (!annule) setError(e.message);
      } finally {
        if (!annule) setLoading(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, []);

  if (loading) return <EtatPage>Chargement des prospects…</EtatPage>;
  if (error) return <EtatPage tone="erreur">{error}</EtatPage>;
  if (!summary) return <EtatPage>Aucune donnée</EtatPage>;

  return <ProspectsPageContent rows={rows} summary={summary} />;
}

function EtatPage({ children, tone }: { children: React.ReactNode; tone?: 'erreur' }) {
  return (
    <div className="p-8">
      <p className={`text-sm ${tone === 'erreur' ? 'text-statut-retard' : 'text-blouin-muted'}`}>{children}</p>
    </div>
  );
}
