import React, { useState } from 'react';
import { Suggestion } from '../../types';
import { Play, ThumbsUp, Share2, Bookmark, MessageSquare } from 'lucide-react';

export const YouTubePreview: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const [descExpanded, setDescExpanded] = useState(false);

  return (
    <div className="bg-[#0f0f0f] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 max-w-xl mx-auto">
      {/* 16:9 Video Mockup Area */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-[#16120b] to-[#1e1305] flex flex-col items-center justify-center p-6 border-b border-slate-800 group">
        {/* Sacred ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Diya & Golden Title in Thumbnail */}
        <div className="relative z-10 text-center max-w-md px-4">
          <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase rounded-md shadow-lg mb-2">
            {suggestion.thumbnailHeadline || 'DEVOTIONAL CHANT'}
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-md leading-tight line-clamp-2">
            {suggestion.title}
          </h4>
          <p className="text-xs text-amber-300/80 mt-2 font-medium">
            {suggestion.strategyLabel}
          </p>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-xs font-semibold text-white">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>15:00</span>
        </div>
      </div>

      {/* Video Info Header */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
          {suggestion.title}
        </h3>

        {/* Channel Details */}
        <div className="flex items-center justify-between mt-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
              BG
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">BhaktiGrow Devotional</p>
              <p className="text-xs text-slate-400">128K subscribers</p>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-white text-slate-950 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors">
            Subscribe
          </button>
        </div>

        {/* Video Actions Bar */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-full font-medium">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>4.8K</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-full font-medium">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-full font-medium">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save</span>
          </div>
        </div>

        {/* Collapsible Description Box */}
        <div className="mt-2 p-3 bg-slate-900/90 rounded-xl text-xs text-slate-300">
          <div className="font-semibold text-slate-200 mb-1">
            24K views • First Frame Hook: &ldquo;{suggestion.hook}&rdquo;
          </div>
          <div className={`whitespace-pre-line leading-relaxed ${descExpanded ? '' : 'line-clamp-3'}`}>
            {suggestion.description}
          </div>
          <button
            type="button"
            onClick={() => setDescExpanded(!descExpanded)}
            className="text-amber-400 hover:text-amber-300 font-semibold mt-1 block"
          >
            {descExpanded ? 'Show less' : '...more'}
          </button>

          {/* Tags */}
          {suggestion.tags && suggestion.tags.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
              {suggestion.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pinned Comment Preview */}
        {suggestion.pinnedComment && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Pinned by BhaktiGrow Devotional</span>
            </div>
            <p className="text-slate-300 italic">
              {suggestion.pinnedComment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
