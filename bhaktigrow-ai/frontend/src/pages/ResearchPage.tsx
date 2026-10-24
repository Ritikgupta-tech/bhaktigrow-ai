import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EvidenceBadge, PlatformBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { SEED_RESEARCH_ITEMS, DEVOTIONAL_CATEGORIES } from '../data/seedData';
import { ResearchItem, Platform, ContentLanguage, DevotionalCategory } from '../types';
import { api } from '../lib/apiClient';
import { PlatformBrandIcon } from '../components/devotional/DevotionalIcons';
import { 
  Compass, 
  Search, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Layers,
  Eye,
  Calendar,
  ExternalLink,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export interface LiveVideoData {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  category: string;
  searchIntent: string;
  contentGapIdea: string;
  editorialAngle: string;
  opportunityScore: number;
  evidenceStatus: 'verified' | 'editorial';
}

export const ResearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryQ = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryQ);
  const [activeSearchQuery, setActiveSearchQuery] = useState(queryQ || 'Hanuman Chalisa');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<ContentLanguage | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DevotionalCategory | 'all'>('all');

  // Live Research State
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveSource, setLiveSource] = useState<string>('');
  const [liveVideos, setLiveVideos] = useState<LiveVideoData[]>([]);
  
  // Trend data: fallback or live
  const [trendData, setTrendData] = useState<Array<{ month: string; volume: number; date?: string }>>([
    { month: 'May', volume: 68 },
    { month: 'Jun', volume: 74 },
    { month: 'Jul', volume: 82 }, // Shravan starts
    { month: 'Aug', volume: 95 }, // Peak Shravan & Krishna Janmashtami
    { month: 'Sep', volume: 88 }, // Ganesh Utsav
    { month: 'Oct', volume: 98 }, // Navratri & Dussehra
    { month: 'Nov', volume: 92 }  // Diwali
  ]);

  const fetchLiveResearch = useCallback(async (query: string) => {
    setIsLoadingLive(true);
    try {
      const res = await api.research.getOverview(query);
      if (res.success && res.data) {
        const { trends, youtube } = res.data as any;
        if (trends && trends.timeline && trends.timeline.length > 0) {
          setTrendData(trends.timeline);
          if (trends.isLive) {
            setIsLiveConnected(true);
            setLiveSource(trends.source);
          }
        }
        if (youtube && youtube.items && youtube.items.length > 0) {
          setLiveVideos(youtube.items);
          if (youtube.isLive) {
            setIsLiveConnected(true);
            setLiveSource(youtube.source);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live research data, keeping editorial models:', err);
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveResearch(activeSearchQuery);
  }, [fetchLiveResearch, activeSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveSearchQuery(searchTerm.trim());
    }
  };

  const formatViews = (views: number): string => {
    if (views >= 1_000_000_000) return (views / 1_000_000_000).toFixed(1) + 'B';
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + 'M';
    if (views >= 1_000) return (views / 1_000).toFixed(0) + 'K';
    return String(views);
  };

  // Filter curated seed items
  const filteredSeedItems = useMemo(() => {
    return SEED_RESEARCH_ITEMS.filter(item => {
      const matchesSearch = !searchTerm.trim() || 
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contentGapIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.editorialAngle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
      const matchesLanguage = selectedLanguage === 'all' || item.language === selectedLanguage;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesPlatform && matchesLanguage && matchesCategory;
    });
  }, [searchTerm, selectedPlatform, selectedLanguage, selectedCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Trend &amp; Keyword Research"
        subtitle="Uncover high-intent devotional search queries, real YouTube search rankings, and seasonal festive patterns."
        icon={<Compass className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Trend Research' }
        ]}
      />

      {/* Dynamic Transparency & Live Verification Banner */}
      {isLiveConnected ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="font-bold text-emerald-300">
                Live API Connection Verified — Real Search Intelligence Active
              </p>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              BhaktiGrow AI is actively connected to the <strong>YouTube Data API v3</strong> and <strong>Google Trends (via SerpApi)</strong>. The search interest timeline, view counts, and video rankings shown below are verified live queries.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">
              Sample research data — not live.
            </p>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              To uphold rigorous transparency: BhaktiGrow AI does not pretend to ping live YouTube/Google search APIs without authentication. All volume indicators and trends below represent qualitative editorial estimates and illustrative samples for devotional creators.
            </p>
          </div>
        </div>
      )}

      {/* Devotional Search Interest Trajectory Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Devotional Search Interest Trajectory ({activeSearchQuery})
            </h3>
            <p className="text-xs text-slate-400">
              {isLiveConnected 
                ? `Live Google Trends index for "${activeSearchQuery}" (IN Geo) via SerpApi.`
                : 'Devotional search interest surges around sacred festivals (Shravan, Janmashtami, Navratri, Diwali)'
              }
            </p>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full self-start sm:self-auto border ${
            isLiveConnected 
              ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' 
              : 'text-purple-300 bg-purple-500/10 border-purple-500/30'
          }`}>
            {isLiveConnected ? '● Live Google Trends' : 'Illustrative Model'}
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="volume" name="Search Interest Index (0-100)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#trendGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live YouTube Search & Analysis Toolbar */}
      <form onSubmit={handleSearchSubmit} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search keywords, prayers, gap ideas, or intent (e.g., Hanuman, Mrityunjaya, Flute)..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoadingLive}
            icon={isLoadingLive ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Search className="w-4 h-4 text-slate-950" />}
          >
            {isLoadingLive ? 'Querying APIs...' : 'Search Live Data'}
          </Button>
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Platform Focus
            </label>
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value as Platform | 'all')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as DevotionalCategory | 'all')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Devotional Categories</option>
              {DEVOTIONAL_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value as ContentLanguage | 'all')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </form>

      {/* Live YouTube Results Section */}
      {liveVideos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlatformBrandIcon platform="youtube" className="w-5 h-5" />
              Live YouTube Search Results &amp; Competitor Intelligence ({liveVideos.length} Videos)
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">
              Verified via YouTube Data API v3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveVideos.map(video => (
              <div
                key={video.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/30 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Video Thumbnail + Header */}
                  <div className="flex gap-4">
                    {video.thumbnailUrl && (
                      <div className="w-28 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-950 relative border border-slate-800">
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        {video.category}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {video.channelTitle}
                      </p>
                    </div>
                  </div>

                  {/* Video Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-300 py-1 border-y border-slate-800/60">
                    <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                      <Eye className="w-3.5 h-3.5" />
                      {formatViews(video.viewCount)} views
                    </span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-emerald-400 font-semibold">
                      Opportunity Score: {video.opportunityScore}/100
                    </span>
                  </div>

                  {/* Content Gap & Editorial Angle */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Content Gap Opportunity:</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {video.contentGapIdea}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Target: {video.searchIntent}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Sparkles className="w-3.5 h-3.5 text-slate-950" />}
                    onClick={() => navigate(`/studio?title=${encodeURIComponent(video.title)}&category=${encodeURIComponent(video.category)}`)}
                  >
                    Use in Studio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Content Strategies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Curated Devotional Gaps &amp; Keyword Strategies ({filteredSeedItems.length})
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
            Editorial Knowledge Base
          </span>
        </div>

        {filteredSeedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSeedItems.map(item => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0c1324] border border-slate-800 hover:border-amber-500/35 transition-all shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {item.platform !== 'all' ? (
                        <PlatformBadge platform={item.platform} />
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                          Multi-Platform
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {item.category}
                      </span>
                    </div>
                    <EvidenceBadge status={item.evidenceStatus} />
                  </div>

                  {/* Term */}
                  <div>
                    <h4 className="text-base font-bold text-white">
                      &ldquo;{item.term}&rdquo;
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>Search Intent: <strong className="text-slate-200">{item.searchIntent}</strong></span>
                      <span>&bull;</span>
                      <span>Language: <strong className="text-slate-200">{item.language}</strong></span>
                    </div>
                  </div>

                  {/* Content Gap Idea */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Audience Content Gap &amp; Need:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {item.contentGapIdea}
                    </p>
                  </div>

                  {/* Editorial Angle */}
                  <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs">
                    <span className="font-semibold text-indigo-300 block mb-1">
                      Recommended Editorial Angle:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {item.editorialAngle}
                    </p>
                  </div>

                  {/* Suggested Concept */}
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">Suggested Video Concept: </span>
                    {item.suggestedConcept}
                  </div>
                </div>

                {/* Bottom CTA to launch studio with this topic */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 italic">
                    Sample volume score: {item.sampleVolumeScore}/100
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Sparkles className="w-3.5 h-3.5 text-slate-950" />}
                    onClick={() => navigate(`/studio?title=${encodeURIComponent(item.term)}&category=${encodeURIComponent(item.category)}`)}
                  >
                    Create Strategy in Studio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Matching Research Records"
            description="Try broadening your search term or resetting the platform/category filters to explore devotional keywords."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPlatform('all');
                  setSelectedCategory('all');
                  setSelectedLanguage('all');
                }}
              >
                Reset Filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};
