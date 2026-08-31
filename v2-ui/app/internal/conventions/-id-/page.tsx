'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ConventionDetailView } from './ConventionDetailView';
import { toConventionDetail } from '@/lib/ui/adapters';
import { ConventionDetailVM } from '@/lib/ui/types';

export default function ConventionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [convention, setConvention] = useState<ConventionDetailVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/internal/conventions/${id}`);
        if (!res.ok) throw new Error('Convention introuvable');
        const json = await res.json();
        if (!annule) setConvention(toConventionDetail(json.data));
      } catch (e: any) {
        if (!annule) setError(e.message);
      } finally {
        if (!annule) setLoading(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [id]);

  if (loading) return <p className="p-8 text-sm text-blouin-muted">Chargement de la convention…</p>;
  if (error) return <p className="p-8 text-sm text-statut-retard">{error}</p>;
  if (!convention) return <p className="p-8 text-sm text-blouin-muted">Aucune donnée</p>;

  return <ConventionDetailView convention={convention} />;
}
