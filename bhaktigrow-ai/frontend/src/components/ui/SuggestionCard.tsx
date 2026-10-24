import React, { useState } from 'react';
import { Suggestion } from '../../types';
import { PlatformBadge, StrategyBadge, EvidenceBadge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { YouTubePreview } from '../previews/YouTubePreview';
import { InstagramReelPreview } from '../previews/InstagramReelPreview';
import { FacebookPostPreview } from '../previews/FacebookPostPreview';
import { copyToClipboard, formatSuggestionAsText } from '../../lib/exportUtils';
import { useSavedItems } from '../../context/SavedItemsContext';
import { useToast } from '../../context/ToastContext';
import { 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Edit3, 
  RefreshCw, 
  Eye, 
  Hash, 
  Image as ImageIcon,
  Check,
  Sparkles
} from 'lucide-react';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onRegenerate?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Suggestion>) => void;
  showPreviewAction?: boolean;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onRegenerate,
  onUpdate,
  showPreviewAction = true
}) => {
  const { isSaved, saveItem, unsaveItem } = useSavedItems();
  const { showToast } = useToast();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(suggestion.title);
  const [editHook, setEditHook] = useState(suggestion.hook);
  const [editDescription, setEditDescription] = useState(suggestion.description);
  const [editCta, setEditCta] = useState(suggestion.cta);

  const saved = isSaved(suggestion.id);

  const handleCopy = async (text: string, label: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      showToast(`Copied ${label} to clipboard!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      showToast(`Failed to copy ${label}`, 'error');
    }
  };

  const handleSaveToggle = () => {
    if (saved) {
      unsaveItem(suggestion.id);
      showToast('Removed from Saved Suggestions', 'info');
    } else {
      saveItem(suggestion);
      showToast('Saved to your collection!', 'success');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(suggestion.id, {
        title: editTitle,
        hook: editHook,
        description: editDescription,
        cta: editCta
      });
    }
    setIsEditOpen(false);
    showToast('Suggestion updated successfully', 'success');
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0c1324] border border-amber-500/15 hover:border-amber-500/35 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between group">
      {/* Top Banner with Badges */}
      <div className="p-5 pb-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <PlatformBadge platform={suggestion.platform} />
            <StrategyBadge strategy={suggestion.strategy} label={suggestion.strategyLabel} />
            <EvidenceBadge status={suggestion.evidenceStatus} />
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSaveToggle}
              className={`p-2 rounded-lg transition-colors ${saved ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title={saved ? 'Remove from Saved' : 'Save Suggestion'}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Edit Suggestion Text"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={() => onRegenerate(suggestion.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                title="Regenerate this specific strategy"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {showPreviewAction && (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="p-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                title="Open Live Social Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title / Headline */}
        <div className="mt-2 flex items-start justify-between gap-3">
          <h4 className="text-base sm:text-lg font-bold text-amber-100 leading-snug">
            {suggestion.title}
          </h4>
          <button
            type="button"
            onClick={() => handleCopy(suggestion.title, 'Title', 'title')}
            className="p-1 text-slate-400 hover:text-amber-300 shrink-0"
            title="Copy Title"
          >
            {copiedKey === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Body Details */}
      <div className="p-5 space-y-4 flex-1 text-xs">
        {/* Hook */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              Opening Hook / First 3 Seconds:
            </span>
            <button
              type="button"
              onClick={() => handleCopy(suggestion.hook, 'Hook', 'hook')}
              className="text-slate-500 hover:text-slate-300"
              title="Copy Hook"
            >
              {copiedKey === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-slate-200 text-xs italic leading-relaxed">
            &ldquo;{suggestion.hook}&rdquo;
          </p>
        </div>

        {/* Description / Caption */}
        <div>
          <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
            <span>Description / Caption:</span>
            <button
              type="button"
              onClick={() => handleCopy(suggestion.description, 'Description', 'desc')}
              className="text-slate-400 hover:text-white"
              title="Copy Description"
            >
              {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
            {suggestion.description}
          </div>
        </div>

        {/* Hashtags & Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 font-medium mb-1.5">
              <span className="flex items-center gap-1 text-[11px]">
                <Hash className="w-3 h-3 text-pink-400" />
                Hashtags ({suggestion.hashtags.length})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(suggestion.hashtags.join(' '), 'Hashtags', 'tags')}
                className="text-slate-500 hover:text-slate-300"
              >
                {copiedKey === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestion.hashtags.map((h, i) => (
                <span key={i} className="text-[10px] text-pink-300/80 bg-pink-500/10 px-1.5 py-0.5 rounded">
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 font-medium mb-1.5">
              <span className="text-[11px] text-indigo-300">
                Search Keywords
              </span>
              <button
                type="button"
                onClick={() => handleCopy(suggestion.searchKeywords.join(', '), 'Keywords', 'kw')}
                className="text-slate-500 hover:text-slate-300"
              >
                {copiedKey === 'kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestion.searchKeywords.map((kw, i) => (
                <span key={i} className="text-[10px] text-indigo-300/80 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail Concept & Call to Action */}
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1 text-[11px]">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Thumbnail Headline: &ldquo;{suggestion.thumbnailHeadline}&rdquo;</span>
          </div>
          <p className="text-slate-300 text-xs">
            {suggestion.thumbnailIdea}
          </p>
          <div className="mt-2 pt-2 border-t border-amber-500/10 text-slate-400 text-[11px]">
            <span className="font-semibold text-amber-300">CTA: </span>{suggestion.cta}
          </div>
        </div>

        {/* Editorial Rationale */}
        <div className="text-[11px] text-slate-400 italic">
          <span className="font-semibold text-slate-300 not-italic">Editorial Rationale: </span>
          {suggestion.editorialRationale}
        </div>
      </div>

      {/* Footer Copy Full Strategy Button */}
      <div className="p-4 pt-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="sm"
          icon={<Copy className="w-3.5 h-3.5" />}
          onClick={() => handleCopy(formatSuggestionAsText(suggestion), 'Complete Strategy Package', 'all')}
          className="w-full"
        >
          {copiedKey === 'all' ? 'Copied Full Package!' : 'Copy Full Strategy Package'}
        </Button>

        {showPreviewAction && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => setIsPreviewOpen(true)}
            className="shrink-0 text-amber-400"
          >
            Preview
          </Button>
        )}
      </div>

      {/* Social Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`${suggestion.platform.toUpperCase()} Post Preview`}
        subtitle={`Realistic rendering of your devotional content with ${suggestion.strategyLabel}`}
        maxWidth={suggestion.platform === 'instagram' ? 'md' : 'xl'}
      >
        <div className="py-2">
          {suggestion.platform === 'youtube' && <YouTubePreview suggestion={suggestion} />}
          {suggestion.platform === 'instagram' && <InstagramReelPreview suggestion={suggestion} />}
          {suggestion.platform === 'facebook' && <FacebookPostPreview suggestion={suggestion} />}
        </div>
      </Modal>

      {/* Edit Suggestion Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Suggestion Text"
        subtitle="Customize copy to suit your channel's unique devotional voice"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title / Opening Hook
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Opening Hook (First 3 Seconds)
            </label>
            <input
              type="text"
              value={editHook}
              onChange={e => setEditHook(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Caption Body
            </label>
            <textarea
              rows={6}
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 font-sans"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Call to Action (CTA)
            </label>
            <input
              type="text"
              value={editCta}
              onChange={e => setEditCta(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
