import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { SEED_LIBRARY_ITEMS, DEVOTIONAL_CATEGORIES } from '../data/seedData';
import { LibraryItem, DevotionalCategory, Suggestion } from '../types';
import { copyToClipboard } from '../lib/exportUtils';
import { useSavedItems } from '../context/SavedItemsContext';
import { useToast } from '../context/ToastContext';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Tag, 
  Eye, 
  Flame,
  ArrowRight
} from 'lucide-react';

export const ContentLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSaved, saveItem, unsaveItem } = useSavedItems();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DevotionalCategory | 'all'>('all');
  const [activeItem, setActiveItem] = useState<LibraryItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return SEED_LIBRARY_ITEMS.filter(item => {
      const matchesSearch = !searchTerm.trim() ||
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.creativeAngle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.searchKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopy = async (text: string, label: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      showToast(`Copied ${label}!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleToggleSave = (item: LibraryItem) => {
    const virtualId = `lib-${item.id}`;
    if (isSaved(virtualId)) {
      unsaveItem(virtualId);
      showToast('Removed from Saved Items', 'info');
    } else {
      // Map to Suggestion format to preserve unified store
      const suggestion: Suggestion = {
        id: virtualId,
        platform: 'youtube',
        strategy: 'search-seo',
        strategyLabel: 'Curated Library Concept',
        title: item.topic,
        hook: item.suggestedHook,
        description: item.sampleDescription,
        hashtags: item.searchKeywords.map(k => `#${k.replace(/\s+/g, '')}`),
        searchKeywords: item.searchKeywords,
        thumbnailIdea: `Devotional concept for ${item.category}`,
        thumbnailHeadline: item.category.toUpperCase(),
        cta: 'Subscribe and share your prayers below.',
        targetAudience: item.potentialAudience,
        contentFormat: item.suggestedFormat,
        editorialRationale: item.creativeAngle,
        evidenceStatus: 'editorial',
        createdAt: new Date().toISOString()
      };
      saveItem(suggestion);
      showToast('Saved idea to your collection!', 'success');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Bhakti Content Library"
        subtitle="Curated library of reverent devotional concepts, creative angles, and authentic opening hooks across 12 sacred categories."
        icon={<BookOpen className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content Library' }
        ]}
      />

      {/* Search & Category Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search concepts, prayers, hooks, keywords..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as DevotionalCategory | 'all')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Categories ({SEED_LIBRARY_ITEMS.length})</option>
              {DEVOTIONAL_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Library Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const saved = isSaved(`lib-${item.id}`);
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0c1324] border border-slate-800 hover:border-amber-500/35 transition-all shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleSave(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        saved ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-white'
                      }`}
                      title={saved ? 'Remove from Saved' : 'Save to Collection'}
                    >
                      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                    {item.topic}
                  </h4>

                  {/* Hook */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <span className="text-[10px] font-semibold text-amber-400 block mb-0.5">
                      Suggested Hook:
                    </span>
                    <p className="text-slate-300 italic">
                      &ldquo;{item.suggestedHook}&rdquo;
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.sampleDescription}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.searchKeywords.map((kw, i) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setActiveItem(item)}
                    className="text-xs text-slate-300"
                  >
                    View Details
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Sparkles className="w-3.5 h-3.5 text-slate-950" />}
                    onClick={() => navigate(`/studio?title=${encodeURIComponent(item.topic)}&category=${encodeURIComponent(item.category)}`)}
                    className="text-xs"
                  >
                    Load in Studio
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Devotional Concepts Found"
          description="Try clearing your search query or choosing another sacred category."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      )}

      {/* Idea Details Modal */}
      {activeItem && (
        <Modal
          isOpen={!!activeItem}
          onClose={() => setActiveItem(null)}
          title={activeItem.topic}
          subtitle={`Category: ${activeItem.category} • Format: ${activeItem.suggestedFormat}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-slate-400 block mb-1">
                Suggested Hook (First 3 Seconds)
              </span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-200 text-sm italic">
                &ldquo;{activeItem.suggestedHook}&rdquo;
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-400 block mb-1">
                Sample Devotional Description
              </span>
              <p className="text-slate-300 text-sm leading-relaxed p-3 bg-slate-950 rounded-xl border border-slate-800">
                {activeItem.sampleDescription}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-400 block mb-1">
                Audience &amp; Angle
              </span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <p className="text-slate-300">
                  <strong className="text-slate-200">Potential Audience: </strong>{activeItem.potentialAudience}
                </p>
                <p className="text-slate-300">
                  <strong className="text-slate-200">Creative Angle: </strong>{activeItem.creativeAngle}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                icon={copiedKey === 'modal' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                onClick={() => handleCopy(`${activeItem.topic}\n\nHook: ${activeItem.suggestedHook}\n\nDescription: ${activeItem.sampleDescription}`, 'Idea Text', 'modal')}
              >
                Copy Text
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-4 h-4 text-slate-950" />}
                onClick={() => {
                  const itm = activeItem;
                  setActiveItem(null);
                  navigate(`/studio?title=${encodeURIComponent(itm.topic)}&category=${encodeURIComponent(itm.category)}`);
                }}
              >
                Create Content in Studio
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
