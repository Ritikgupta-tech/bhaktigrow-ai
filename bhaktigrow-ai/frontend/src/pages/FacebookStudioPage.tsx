import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { SuggestionCard } from '../components/ui/SuggestionCard';
import { PlatformBrandIcon } from '../components/devotional/DevotionalIcons';
import { generateSuggestions, suggestionEngine } from '../lib/suggestionEngine';
import { exportSuggestionsAsTxt } from '../lib/exportUtils';
import { Suggestion, StudioFormInput, DevotionalCategory } from '../types';
import { DEVOTIONAL_CATEGORIES } from '../data/seedData';
import { useToast } from '../context/ToastContext';
import { Download, RefreshCw, Sparkles } from 'lucide-react';

export const FacebookStudioPage: React.FC = () => {
  const { showToast } = useToast();

  const [topic, setTopic] = useState('Jai Ganesh Deva Evening Family Aarti & Pooja Chants');
  const [category, setCategory] = useState<DevotionalCategory>('Ganesh Aarti');
  const [keywords, setKeywords] = useState('Ganesh Aarti, Evening Pooja, Family Devotion, Vighnaharta');

  const initialInput: StudioFormInput = {
    videoTitle: topic,
    category,
    language: 'Hindi',
    videoFormat: 'Facebook Video',
    platforms: ['facebook'],
    primaryKeywords: keywords,
    targetAudience: 'Family satsang groups, multi-generational devotees, community prayer circles',
    tone: 'Reverent'
  };

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    return generateSuggestions(initialInput, ['facebook']);
  });

  const handleRegenerateAll = () => {
    const updatedInput: StudioFormInput = {
      ...initialInput,
      videoTitle: topic,
      category,
      primaryKeywords: keywords
    };
    const fresh = generateSuggestions(updatedInput, ['facebook']);
    setSuggestions(fresh);
    showToast('Formulated 5 new Facebook community strategies!', 'success');
  };

  const handleRegenerateSingle = (id: string) => {
    const updatedInput: StudioFormInput = {
      ...initialInput,
      videoTitle: topic,
      category,
      primaryKeywords: keywords
    };
    const regen = suggestionEngine.regenerate(id, suggestions, updatedInput);
    setSuggestions(prev => prev.map(s => (s.id === id ? regen : s)));
    showToast(`Regenerated ${regen.strategyLabel} Facebook strategy!`, 'success');
  };

  const handleUpdate = (id: string, updates: Partial<Suggestion>) => {
    setSuggestions(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Facebook Community Video Studio"
        subtitle="5 family and community-oriented video frameworks: Family Aarti routines, Nostalgic Heritage discussions, Empathy & Prayer Requests, Global Devotional Circles, and Evening Relaxation."
        icon={<PlatformBrandIcon platform="facebook" className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Facebook Studio' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => exportSuggestionsAsTxt(suggestions, 'facebook-bhaktigrow-strategies.txt')}
            >
              Export All (.txt)
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={handleRegenerateAll}
            >
              Regenerate 5 Ideas
            </Button>
          </div>
        }
      />

      {/* Quick Topic Adjuster */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-blue-500/20 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Devotional Video Title / Satsang Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full md:w-56">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as DevotionalCategory)}
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {DEVOTIONAL_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="pt-5 w-full md:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4 text-slate-950" />}
              onClick={handleRegenerateAll}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              Apply Topic
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Distinct Facebook Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {suggestions.map(s => (
          <SuggestionCard
            key={s.id}
            suggestion={s}
            onRegenerate={handleRegenerateSingle}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};
