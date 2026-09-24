import React from 'react';
import { FolderPlus } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = FolderPlus,
  title = 'No data available',
  description = 'Get started by creating a new entry.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="w-full py-12 px-4 flex flex-col items-center justify-center text-center bg-zinc-900/40 border border-zinc-800/80 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-zinc-100 mb-1">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
