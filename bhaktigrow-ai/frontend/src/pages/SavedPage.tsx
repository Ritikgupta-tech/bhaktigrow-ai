import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { SuggestionCard } from '../components/ui/SuggestionCard';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useSavedItems } from '../context/SavedItemsContext';
import { useToast } from '../context/ToastContext';
import { exportSuggestionsAsTxt } from '../lib/exportUtils';
import { Platform } from '../types';
import { Bookmark, Search, Download, Trash2, Filter } from 'lucide-react';

export const SavedPage: React.FC = () => {
  const { savedItems, updateSavedItem, clearAllSaved, totalSavedCount } = useSavedItems();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return savedItems.filter(item => {
      const matchSearch = !searchTerm.trim() ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hook.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.searchKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchPlatform = filterPlatform === 'all' || item.platform === filterPlatform;

      return matchSearch && matchPlatform;
    });
  }, [savedItems, searchTerm, filterPlatform]);

  const handleClearAll = () => {
    clearAllSaved();
    showToast('Cleared all saved suggestions', 'info');
    setIsClearConfirmOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Saved Devotional Suggestions"
        subtitle="Unified collection of all your bookmarked content strategies across YouTube, Instagram, Facebook, and the Bhakti Library."
        icon={<Bookmark className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Saved Suggestions' }
        ]}
        actions={
          totalSavedCount > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => exportSuggestionsAsTxt(savedItems, 'bhaktigrow-saved-collection.txt')}
              >
                Export All ({totalSavedCount})
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsClearConfirmOpen(true)}
              >
                Clear All
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Search and Platform Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search your saved titles, hooks, keywords..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterPlatform('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterPlatform === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({totalSavedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterPlatform('youtube')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterPlatform === 'youtube'
                  ? 'bg-red-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              YouTube
            </button>
            <button
              type="button"
              onClick={() => setFilterPlatform('instagram')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterPlatform === 'instagram'
                  ? 'bg-pink-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Instagram
            </button>
            <button
              type="button"
              onClick={() => setFilterPlatform('facebook')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterPlatform === 'facebook'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Facebook
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Saved Suggestions */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onUpdate={(id, updates) => updateSavedItem(id, updates)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={totalSavedCount === 0 ? 'No Saved Suggestions Yet' : 'No Matching Saved Suggestions'}
          description={
            totalSavedCount === 0
              ? 'Bookmark high-performing titles, hooks, or captions from the AI Content Studio, YouTube Studio, Instagram Studio, or Bhakti Content Library to access them here anytime.'
              : 'Try clearing your search query or switching to another platform tab.'
          }
          action={
            totalSavedCount === 0 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.location.assign('/studio')}
              >
                Go to AI Studio
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterPlatform('all');
                }}
              >
                Reset Filters
              </Button>
            )
          }
        />
      )}

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Saved Suggestions"
        message="Are you sure you want to remove all saved suggestions from your local collection? This action will permanently remove them from your browser storage."
        confirmLabel="Clear All"
        isDestructive={true}
      />
    </div>
  );
};
