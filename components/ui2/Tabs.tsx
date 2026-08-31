'use client';

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" className="flex gap-6 border-b border-blouin-line">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`focus-ring -mb-px border-b-2 pb-2.5 text-sm font-semibold transition-colors ${
            active === tab.id
              ? 'border-blouin-gold text-blouin-dark'
              : 'border-transparent text-blouin-muted hover:text-blouin-dark'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
