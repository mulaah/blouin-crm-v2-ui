import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'gold' | 'peach' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-blouin-dark text-white hover:bg-blouin-darkHover',
  gold: 'bg-blouin-gold text-white hover:bg-blouin-goldDark',
  peach: 'bg-blouin-peach text-white hover:bg-blouin-goldDark',
  ghost: 'border border-blouin-line bg-white text-blouin-dark hover:bg-blouin-cream',
};

export function Button({
  variant = 'ghost',
  icon,
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: ReactNode }) {
  return (
    <button
      type="button"
      className={`focus-ring inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-45 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
