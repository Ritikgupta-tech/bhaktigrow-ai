import React, { ReactNode } from 'react';
import { DiyaFlameIcon } from '../devotional/DevotionalIcons';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm">
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 shadow-inner">
        {icon || <DiyaFlameIcon className="w-10 h-10" />}
      </div>
      <h4 className="text-lg font-semibold text-slate-100 mb-2">
        {title}
      </h4>
      <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
