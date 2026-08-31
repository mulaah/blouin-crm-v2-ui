'use client';

import { useEffect, useState } from 'react';
import { ConsultationsView } from './ConsultationsView';
import { toConsultations } from '@/lib/ui/adapters';
import { ConsultationsVM } from '@/lib/ui/types';

export default function ConsultationsProspectPage({
  params,
}: {
  params: { prospect_id: string };
}) {
  const [data, setData] = useState<ConsultationsVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/internal/consultations/prospect/${params.prospect_id}`);
        if (!res.ok) throw new Error('Prospect introuvable');
        const json = await res.json();
        if (!annule) setData(toConsultations(json.data));
      } catch (e: any) {
        if (!annule) setError(e.message);
      } finally {
        if (!annule) setLoading(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [params.prospect_id]);

  if (loading) return <p className="p-8 text-sm text-blouin-muted">Chargement des consultations…</p>;
  if (error) return <p className="p-8 text-sm text-statut-retard">{error}</p>;
  if (!data) return <p className="p-8 text-sm text-blouin-muted">Aucune donnée</p>;

  return <ConsultationsView data={data} />;
}
