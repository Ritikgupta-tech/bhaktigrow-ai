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

export const InstagramStudioPage: React.FC = () => {
  const { showToast } = useToast();

  const [topic, setTopic] = useState('Radha Krishna Soulful Morning Chants');
  const [category, setCategory] = useState<DevotionalCategory>('Krishna Bhajan');
  const [keywords, setKeywords] = useState('Radha Krishna, Morning Bhakti, Positive Energy');

  const initialInput: StudioFormInput = {
    videoTitle: topic,
    category,
    language: 'Hindi',
    videoFormat: 'Instagram Reel',
    platforms: ['instagram'],
    primaryKeywords: keywords,
    targetAudience: 'Reel viewers, spiritual seekers, daily morning pooja practitioners',
    tone: 'Peaceful/Meditative'
  };

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    return generateSuggestions(initialInput, ['instagram']);
  });

  const handleRegenerateAll = () => {
    const updatedInput: StudioFormInput = {
      ...initialInput,
      videoTitle: topic,
      category,
      primaryKeywords: keywords
    };
    const fresh = generateSuggestions(updatedInput, ['instagram']);
    setSuggestions(fresh);
    showToast('Formulated 5 new Instagram Reel strategies!', 'success');
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
    showToast(`Regenerated ${regen.strategyLabel} Instagram strategy!`, 'success');
  };

  const handleUpdate = (id: string, updates: Partial<Suggestion>) => {
    setSuggestions(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Instagram Devotional Reel Studio"
        subtitle="5 vertical Reel strategies with opening scroll-stopping hooks, cover headlines, on-screen text, subtitle guidance, and aesthetic devotional hashtags."
        icon={<PlatformBrandIcon platform="instagram" className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Instagram Studio' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => exportSuggestionsAsTxt(suggestions, 'instagram-bhaktigrow-strategies.txt')}
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
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-pink-500/20 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Devotional Topic / Reel Theme
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="w-full md:w-56">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as DevotionalCategory)}
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500"
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
              className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            >
              Apply Theme
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Distinct Instagram Suggestions Grid */}
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
