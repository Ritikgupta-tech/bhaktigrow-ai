import React, { useState } from 'react';
import { Suggestion } from '../../types';
import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal } from 'lucide-react';

export const FacebookPostPreview: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const [descExpanded, setDescExpanded] = useState(false);

  return (
    <div className="bg-[#18191a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 max-w-xl mx-auto font-sans">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
            BG
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">BhaktiGrow Satsang &amp; Prayers</span>
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span>Just now</span>
              <span>&bull;</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Text / Caption */}
      <div className="px-4 pb-3 text-sm text-slate-200 leading-relaxed">
        <div className="font-semibold text-amber-300 mb-1">
          {suggestion.hook}
        </div>
        <div className={`whitespace-pre-line ${descExpanded ? '' : 'line-clamp-4'}`}>
          {suggestion.description}
        </div>
        <button
          type="button"
          onClick={() => setDescExpanded(!descExpanded)}
          className="text-amber-400 hover:text-amber-300 font-semibold mt-1 text-xs block"
        >
          {descExpanded ? 'See less' : 'See more'}
        </button>

        {/* Community Angle Callout */}
        {suggestion.communityAngle && (
          <div className="mt-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
            <span className="font-semibold text-blue-300">Community Angle: </span>
            {suggestion.communityAngle}
          </div>
        )}
      </div>

      {/* Video / Graphic Frame */}
      <div className="relative aspect-video bg-gradient-to-br from-[#121420] via-[#1a1c2e] to-[#0d0f17] flex flex-col items-center justify-center p-6 border-y border-slate-800 text-center">
        <div className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-md mb-2">
          {suggestion.thumbnailHeadline || 'FAMILY PRAYER'}
        </div>
        <h4 className="text-xl font-bold text-amber-100 max-w-md line-clamp-2">
          {suggestion.title}
        </h4>
        <p className="text-xs text-slate-300 mt-2 max-w-sm line-clamp-1">
          {suggestion.thumbnailIdea}
        </p>
      </div>

      {/* Social Engagement Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white">👍</span>
          <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[9px] text-white">❤️</span>
          <span>1.4K</span>
        </div>
        <div className="flex items-center gap-3">
          <span>246 comments</span>
          <span>118 shares</span>
        </div>
      </div>

      {/* Reaction Buttons */}
      <div className="px-4 py-1.5 flex items-center justify-around text-xs font-semibold text-slate-300 border-b border-slate-800">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Pinned Community Prayer / Comment */}
      {suggestion.pinnedComment && (
        <div className="p-3 bg-slate-900/60 text-xs">
          <span className="text-amber-400 font-semibold block mb-1">
            Top Devotional Comment:
          </span>
          <p className="text-slate-300 italic">
            &ldquo;{suggestion.pinnedComment}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
