'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  MessageSquare,
  FileText,
  Wallet,
  Inbox,
  Cog,
  TrendingUp,
  Settings,
} from 'lucide-react';

/**
 * Sidebar de la direction retenue : fond zellige-dark, libellés flush left,
 * compteur par module à droite (la planche 2a affiche 347 / 212 / 58 / 96 / 31).
 *
 * Les compteurs viennent des props — branche-les sur tes agrégats
 * (ex. GET /api/internal/counters) ; sans props, ils ne s'affichent pas.
 */
export interface SidebarCounts {
  prospects?: number | null;
  consultations?: number | null;
  conventions?: number | null;
  versements?: number | null;
  demandes?: number | null;
}

export function InternalSidebar({
  counts = {},
  user = { nom: 'Marie-Claude B.', role: 'Avocate associée', initiales: 'MB' },
}: {
  counts?: SidebarCounts;
  user?: { nom: string; role: string; initiales: string };
}) {
  const pathname = usePathname();

  const dossiers = [
    { icon: BarChart3, label: 'Tableau de bord', href: '/internal/dashboard', count: null },
    { icon: Users, label: 'Prospects', href: '/internal/prospects', count: counts.prospects ?? null },
    { icon: MessageSquare, label: 'Consultations', href: '/internal/consultations', count: counts.consultations ?? null },
    { icon: FileText, label: 'Conventions', href: '/internal/conventions', count: counts.conventions ?? null },
    { icon: Wallet, label: 'Versements', href: '/internal/versements', count: counts.versements ?? null },
    { icon: Inbox, label: 'Demandes', href: '/internal/documents', count: counts.demandes ?? null },
  ];

  const administration = [
    { icon: Cog, label: 'Configurations', href: '/internal/configurations' },
    { icon: TrendingUp, label: 'Rapports', href: '/internal/reports' },
    { icon: Settings, label: 'Paramètres', href: '/internal/settings' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="zellige-dark flex w-[248px] shrink-0 flex-col text-white">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/logo-blouin.svg" alt="" aria-hidden className="h-7 w-auto opacity-90" />
        <div className="min-w-0">
          <p className="font-poppins text-sm font-bold leading-tight">Blouin CRM</p>
          <p className="text-[11px] leading-tight text-blouin-gold">Cabinet — Montréal</p>
        </div>
      </div>

      <div className="mx-5 h-px bg-blouin-gold/40" />

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Dossiers">
        <p className="eyebrow px-2 pb-2 text-blouin-gold/80">Dossiers</p>
        <ul className="space-y-0.5">
          {dossiers.map((item) => (
            <li key={item.href}>
              <NavRow {...item} active={isActive(item.href)} />
            </li>
          ))}
        </ul>

        <p className="eyebrow px-2 pb-2 pt-6 text-blouin-gold/80">Administration</p>
        <ul className="space-y-0.5">
          {administration.map((item) => (
            <li key={item.href}>
              <NavRow {...item} count={null} active={isActive(item.href)} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-5 h-px bg-blouin-gold/40" />

      <div className="flex items-center gap-3 px-5 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blouin-gold text-xs font-bold text-blouin-dark">
          {user.initiales}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">{user.nom}</p>
          <p className="truncate text-[11px] text-white/60">{user.role}</p>
        </div>
      </div>
    </aside>
  );
}

function NavRow({
  icon: Icon,
  label,
  href,
  count,
  active,
}: {
  icon: typeof Users;
  label: string;
  href: string;
  count?: number | null;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`focus-ring flex items-center gap-3 px-2 py-2 text-sm transition-colors ${
        active
          ? 'bg-blouin-gold font-semibold text-blouin-dark'
          : 'text-white/85 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={16} className="shrink-0 opacity-80" />
      <span className="flex-1 truncate">{label}</span>
      {count !== null && count !== undefined ? (
        <span className={`tnum text-xs ${active ? 'text-blouin-dark/70' : 'text-white/50'}`}>{count}</span>
      ) : null}
    </Link>
  );
}
