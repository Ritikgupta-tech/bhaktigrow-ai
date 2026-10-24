import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Bookmark, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  Flame, 
  BookOpen, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { PlatformBadge, CalendarStatusBadge } from '../components/ui/Badge';
import { DiyaFlameIcon, PlatformBrandIcon } from '../components/devotional/DevotionalIcons';
import { useSavedItems } from '../context/SavedItemsContext';
import { useCalendar } from '../context/CalendarContext';
import { SEED_LIBRARY_ITEMS, DEVOTIONAL_CATEGORIES } from '../data/seedData';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { totalSavedCount, savedItems } = useSavedItems();
  const { entries } = useCalendar();

  // Metrics derived from local state
  const upcomingDemoEntries = entries.slice(0, 4);
  const draftCount = entries.filter(e => e.status === 'Draft').length;
  const scheduledCount = entries.filter(e => e.status === 'Scheduled Demo').length;

  // Illustrative weekly production chart data
  const weeklyProductionData = [
    { day: 'Mon', youtube: 1, instagram: 3, facebook: 2 },
    { day: 'Tue', youtube: 2, instagram: 4, facebook: 2 }, // Hanuman Tuesday
    { day: 'Wed', youtube: 1, instagram: 2, facebook: 1 },
    { day: 'Thu', youtube: 1, instagram: 3, facebook: 2 },
    { day: 'Fri', youtube: 2, instagram: 4, facebook: 3 }, // Friday Devi
    { day: 'Sat', youtube: 1, instagram: 3, facebook: 2 },
    { day: 'Sun', youtube: 2, instagram: 5, facebook: 3 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#171b30] via-[#1b192c] to-[#251817] border border-amber-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <DiyaFlameIcon className="w-4 h-4" />
              <span>Sacred Sanatan Strategy Suite</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Devotional Content Creator Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Plan, optimize, and expand your reach across YouTube, Instagram, and Facebook with tailored spiritual content frameworks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={<Sparkles className="w-5 h-5 text-slate-950" />}
              onClick={() => navigate('/studio')}
              className="shadow-xl shadow-amber-500/20"
            >
              Generate Strategies
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<BookOpen className="w-5 h-5" />}
              onClick={() => navigate('/library')}
            >
              Explore Library
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Key Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Saved Suggestions */}
        <div 
          onClick={() => navigate('/saved')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Saved Suggestions
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalSavedCount}</span>
            <span className="text-xs text-amber-400 font-medium">In local store</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-200">
            <span>View saved library</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Card 2: Draft Calendar Items */}
        <div 
          onClick={() => navigate('/calendar')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Content Drafts
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{draftCount}</span>
            <span className="text-xs text-indigo-400 font-medium">Planned in calendar</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-200">
            <span>Open calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Card 3: Scheduled Demo */}
        <div 
          onClick={() => navigate('/calendar')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Scheduled Demos
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{scheduledCount}</span>
            <span className="text-xs text-emerald-400 font-medium">Upcoming releases</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-200">
            <span>Manage schedules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Card 4: Devotional Categories */}
        <div 
          onClick={() => navigate('/library')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Bhakti Categories
            </span>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{DEVOTIONAL_CATEGORIES.length}</span>
            <span className="text-xs text-pink-400 font-medium">Sacred archetypes</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-200">
            <span>Browse library</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>

      {/* 3 Dedicated Social Studio Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Dedicated Social Studios
            </h3>
            <p className="text-xs text-slate-400">
              One creative idea produces 5 unique platform-specific strategies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* YouTube Studio Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1c1313] to-[#120d0d] border border-red-500/25 hover:border-red-500/50 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform="youtube" />
                <span className="text-xs font-semibold text-red-400/90">5 Strategies</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
                YouTube Long &amp; Shorts
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                SEO-focused titles, detailed devotional descriptions, high-intent keywords, pinned comments, and high-CTR thumbnail concepts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-red-500/20 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Long-form &amp; Shorts</span>
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => navigate('/youtube')}
                className="text-red-400 hover:text-white"
              >
                Open Studio
              </Button>
            </div>
          </div>

          {/* Instagram Studio Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1c1322] to-[#110d17] border border-pink-500/25 hover:border-pink-500/50 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform="instagram" />
                <span className="text-xs font-semibold text-pink-400/90">5 Strategies</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                Instagram Reels &amp; Feeds
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Scroll-stopping opening hooks, vertical Reel cover text, aesthetic prayer captions, on-screen text overlays, and subtitle pacing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">9:16 Vertical Reels</span>
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => navigate('/instagram')}
                className="text-pink-400 hover:text-white"
              >
                Open Studio
              </Button>
            </div>
          </div>

          {/* Facebook Studio Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11192b] to-[#0c111e] border border-blue-500/25 hover:border-blue-500/50 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform="facebook" />
                <span className="text-xs font-semibold text-blue-400/90">5 Strategies</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                Facebook Community Video
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Community-driven satsang captions, multi-generational angles, prayer request comments, and family shareable video formats.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-500/20 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Family Satsang &amp; Groups</span>
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => navigate('/facebook')}
                className="text-blue-400 hover:text-white"
              >
                Open Studio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Production Chart & Upcoming Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Content Production Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-white">
                Weekly Content Output by Platform
              </h4>
              <p className="text-xs text-slate-400">
                Sample distribution across weekly pooja &amp; satsang days (Illustrative demo data)
              </p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Sample Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProductionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="youtube" name="YouTube" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="instagram" name="Instagram" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="facebook" name="Facebook" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Calendar Entries (1 col) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Upcoming Planning
              </h4>
              <button 
                onClick={() => navigate('/calendar')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {upcomingDemoEntries.map(entry => (
                <div key={entry.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <PlatformBadge platform={entry.platform} />
                    <CalendarStatusBadge status={entry.status} />
                  </div>
                  <p className="font-semibold text-slate-200 truncate mt-1">
                    {entry.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(entry.plannedDateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/calendar')}
              className="w-full text-xs"
            >
              Add Calendar Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Content Inspiration from Library */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Devotional Topic Inspiration
            </h3>
            <p className="text-xs text-slate-400">
              High-affinity spiritual subjects ready to load into the AI Content Studio.
            </p>
          </div>
          <button 
            onClick={() => navigate('/library')} 
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Full Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEED_LIBRARY_ITEMS.slice(0, 3).map(item => (
            <div 
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-2 leading-snug">
                  {item.topic}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {item.sampleDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.suggestedFormat}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/studio?title=${encodeURIComponent(item.topic)}&category=${encodeURIComponent(item.category)}`)}
                  className="text-xs text-amber-400 hover:text-white"
                >
                  Create Strategy &rarr;
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
