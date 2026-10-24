import React, { useState } from 'react';
import { Suggestion } from '../../types';
import { Heart, MessageCircle, Send, Bookmark, Music, MoreHorizontal } from 'lucide-react';
import { DiyaFlameIcon } from '../devotional/DevotionalIcons';

export const InstagramReelPreview: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const [liked, setLiked] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);

  return (
    <div className="max-w-[340px] mx-auto bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white">
      {/* 9:16 Vertical Reel Frame */}
      <div className="relative aspect-[9/16] bg-gradient-to-b from-[#181124] via-[#0d0f1f] to-[#08080c] flex flex-col justify-between p-4 overflow-hidden">
        {/* Ambient sacred mandala background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18)_0%,transparent_60%)] pointer-events-none" />
        
        {/* Top Header: Safe zone */}
        <div className="relative z-10 flex items-center justify-between text-xs font-semibold pt-1">
          <span className="tracking-wider uppercase text-amber-400 font-bold flex items-center gap-1">
            <DiyaFlameIcon className="w-4 h-4" />
            Reels
          </span>
          <MoreHorizontal className="w-5 h-5 text-slate-300" />
        </div>

        {/* Center: Dynamic On-Screen Text / Cover Graphic */}
        <div className="relative z-10 text-center px-3 my-auto">
          {suggestion.reelCoverText && (
            <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-lg mb-3">
              {suggestion.reelCoverText}
            </div>
          )}
          <h3 className="text-xl font-extrabold text-amber-100 drop-shadow-lg leading-snug">
            {suggestion.hook}
          </h3>
          {suggestion.onScreenText && (
            <div className="mt-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/30 text-xs font-medium text-amber-200">
              {suggestion.onScreenText}
            </div>
          )}
          {suggestion.subtitleGuidance && (
            <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/70 py-1 px-2 rounded-md inline-block">
              Guidance: {suggestion.subtitleGuidance}
            </div>
          )}
        </div>

        {/* Bottom Section: Profile + Caption + Audio */}
        <div className="relative z-10 flex items-end justify-between gap-3">
          <div className="flex-1 text-xs">
            {/* Account pill */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-[10px] text-amber-400">
                  BG
                </div>
              </div>
              <span className="font-bold text-white text-xs">bhaktigrow.devotional</span>
              <button className="text-[11px] font-semibold text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded-full hover:bg-amber-400/10">
                Follow
              </button>
            </div>

            {/* Caption */}
            <div className="text-[11px] text-slate-200 leading-snug">
              <p className={captionExpanded ? 'whitespace-pre-line' : 'line-clamp-2'}>
                {suggestion.description}
              </p>
              <button
                type="button"
                onClick={() => setCaptionExpanded(!captionExpanded)}
                className="text-slate-400 font-semibold mt-0.5"
              >
                {captionExpanded ? 'less' : '...more'}
              </button>
            </div>

            {/* Audio Pill */}
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-300">
              <Music className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="truncate">Sacred Chants &bull; Original Audio (432Hz)</span>
            </div>
          </div>

          {/* Right Action Rail */}
          <div className="flex flex-col items-center gap-4 text-xs font-semibold">
            <button 
              type="button" 
              onClick={() => setLiked(!liked)} 
              className="flex flex-col items-center gap-1"
            >
              <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              <span className="text-[10px]">12.4K</span>
            </button>
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="text-[10px]">482</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Send className="w-6 h-6 text-white" />
              <span className="text-[10px]">Share</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
