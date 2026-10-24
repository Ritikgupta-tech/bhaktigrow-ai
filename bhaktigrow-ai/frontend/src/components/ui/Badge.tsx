import React from 'react';
import { Platform, StrategyType, EvidenceStatus, CalendarStatus } from '../../types';
import { PlatformBrandIcon } from '../devotional/DevotionalIcons';

export const PlatformBadge: React.FC<{ platform: Platform; showIcon?: boolean; className?: string }> = ({
  platform,
  showIcon = true,
  className = ''
}) => {
  const configs = {
    youtube: {
      label: 'YouTube',
      style: 'bg-red-500/10 text-red-400 border-red-500/30'
    },
    instagram: {
      label: 'Instagram',
      style: 'bg-pink-500/10 text-pink-400 border-pink-500/30'
    },
    facebook: {
      label: 'Facebook',
      style: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    }
  };

  const c = configs[platform];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.style} ${className}`}>
      {showIcon && <PlatformBrandIcon platform={platform} className="w-3.5 h-3.5" />}
      {c.label}
    </span>
  );
};

export const StrategyBadge: React.FC<{ strategy: StrategyType; label?: string; className?: string }> = ({
  strategy,
  label,
  className = ''
}) => {
  const configs: Record<StrategyType, { label: string; style: string }> = {
    'search-seo': {
      label: 'Search SEO',
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    'curiosity-hook': {
      label: 'Curiosity Hook',
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    'emotional-story': {
      label: 'Emotional Story',
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    },
    'community-engagement': {
      label: 'Community',
      style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
    },
    'calm-meditative': {
      label: 'Meditative Peace',
      style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    }
  };

  const item = configs[strategy] || { label: strategy, style: 'bg-slate-700 text-slate-300 border-slate-600' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${item.style} ${className}`}>
      {label || item.label}
    </span>
  );
};

export const EvidenceBadge: React.FC<{ status: EvidenceStatus; className?: string }> = ({
  status,
  className = ''
}) => {
  const configs: Record<EvidenceStatus, { text: string; style: string; tooltip: string }> = {
    verified: {
      text: 'Verified Source',
      style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      tooltip: 'Supported by accessible source & real retrieval timestamp'
    },
    calculated: {
      text: 'Calculated Metric',
      style: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      tooltip: 'Derived mathematically from local state'
    },
    editorial: {
      text: 'Editorial Suggestion',
      style: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      tooltip: 'Devotional qualitative strategy recommendation'
    },
    illustrative: {
      text: 'Sample Research Data (Demo)',
      style: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
      tooltip: 'Simulated preview data for illustration only'
    }
  };

  const item = configs[status] || configs.illustrative;

  return (
    <span 
      title={item.tooltip}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-help ${item.style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {item.text}
    </span>
  );
};

export const CalendarStatusBadge: React.FC<{ status: CalendarStatus; className?: string }> = ({
  status,
  className = ''
}) => {
  const configs: Record<CalendarStatus, string> = {
    'Draft': 'bg-slate-700/50 text-slate-300 border-slate-600',
    'Scheduled Demo': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'Published Demo': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${configs[status]} ${className}`}>
      {status}
    </span>
  );
};
