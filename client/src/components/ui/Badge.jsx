import React from 'react';

const badgeVariants = {
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  zinc: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/50'
};

export const Badge = ({ children, variant = 'indigo', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeVariants[variant] || badgeVariants.indigo} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
