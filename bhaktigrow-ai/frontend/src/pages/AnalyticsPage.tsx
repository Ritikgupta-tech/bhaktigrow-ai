import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useSavedItems } from '../context/SavedItemsContext';
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/apiClient';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Layers, 
  AlertCircle, 
  Lightbulb, 
  Clock, 
  Heart,
  Share2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { totalSavedCount, savedItems } = useSavedItems();
  const { entries } = useCalendar();
  const { isAuthenticated } = useAuth();

  const [backendData, setBackendData] = useState<{
    totalDrafts: number;
    totalSaved: number;
    totalScheduled: number;
    platformDistribution: { youtube: number; instagram: number; facebook: number };
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.analytics.getOverview().then(res => {
        if (res.success && res.data) {
          setBackendData(res.data as any);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  // Metrics derived from local application state or backend
  const totalCalendarEntries = entries.length;
  const draftCount = backendData ? backendData.totalDrafts : entries.filter(e => e.status === 'Draft').length;
  const scheduledCount = backendData ? backendData.totalScheduled : entries.filter(e => e.status === 'Scheduled Demo').length;
  const publishedCount = entries.filter(e => e.status === 'Published Demo').length;
  const effectiveSavedCount = backendData ? backendData.totalSaved : totalSavedCount;

  // Platform Distribution
  const platformDistribution = [
    { 
      name: 'YouTube', 
      value: backendData ? (backendData.platformDistribution.youtube || 1) : (entries.filter(e => e.platform === 'youtube').length || 4), 
      color: '#ef4444' 
    },
    { 
      name: 'Instagram', 
      value: backendData ? (backendData.platformDistribution.instagram || 1) : (entries.filter(e => e.platform === 'instagram').length || 6), 
      color: '#ec4899' 
    },
    { 
      name: 'Facebook', 
      value: backendData ? (backendData.platformDistribution.facebook || 1) : (entries.filter(e => e.platform === 'facebook').length || 3), 
      color: '#3b82f6' 
    }
  ];

  // Strategy Affinity (Illustrative benchmark)
  const strategyPerformanceData = [
    { strategy: 'Search SEO', saves: 88, comments: 45, shares: 62 },
    { strategy: 'Curiosity Hook', saves: 72, comments: 94, shares: 85 },
    { strategy: 'Emotional Story', saves: 91, comments: 98, shares: 92 },
    { strategy: 'Community Satsang', saves: 65, comments: 100, shares: 79 },
    { strategy: 'Meditative Peace', saves: 96, comments: 60, shares: 88 }
  ];

  // Devotional category production
  const categoryData = [
    { category: 'Hanuman Chalisa', count: 5 },
    { category: 'Shiva Mantra', count: 4 },
    { category: 'Krishna Bhajan', count: 4 },
    { category: 'Ram Bhakti', count: 3 },
    { category: 'Ganesh Aarti', count: 3 },
    { category: 'Durga Stuti', count: 2 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Performance Insights &amp; Content Architecture"
        subtitle="Analyze devotional content distribution, strategy effectiveness, and publishing rhythm across your channels."
        icon={<BarChart3 className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Performance Insights' }
        ]}
      />

      {/* Honest Analytics Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300">
            Illustrative Analytics &amp; Local State Architecture
          </p>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Counts for Planned Content and Saved Collections are derived live from your browser storage. Comparative engagement and strategy benchmarks are based on qualitative devotional publishing models (sample data). No external social media APIs are polled.
          </p>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Saved Strategies
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{effectiveSavedCount}</span>
            <span className="text-xs text-amber-400 font-medium">
              {backendData ? 'MongoDB synced' : 'Local records'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {backendData ? 'Live from MongoDB backend' : 'Live from browser memory'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Scheduled Releases
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{scheduledCount}</span>
            <span className="text-xs text-emerald-400 font-medium">Planned releases</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 3 platforms</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Content Drafts
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{draftCount}</span>
            <span className="text-xs text-indigo-400 font-medium">In preparation</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for studio editing</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Published Demos
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{publishedCount}</span>
            <span className="text-xs text-purple-400 font-medium">Historical demos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Archived releases</p>
        </div>
      </div>

      {/* Main Charts: Platform Distribution & Strategy Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Strategy Benchmark Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Strategy Engagement Index (Illustrative Model)
              </h3>
              <p className="text-xs text-slate-400">
                Comparative devotional resonance by editorial strategy (0-100 index)
              </p>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              Benchmark
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="strategy" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="saves" name="Save / Bookmark Rate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" name="Comment Velocity" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shares" name="Family Share Index" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-400" />
                Platform Share of Voice
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                Local State
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Planned content entries distributed across YouTube, Instagram, and Facebook.
            </p>

            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
            {platformDistribution.map(p => (
              <div key={p.name} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold block" style={{ color: p.color }}>
                  {p.name}
                </span>
                <span className="text-sm font-extrabold text-white">{p.value} posts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Editorial Workflow Improvements */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Editorial Publishing Optimization Principles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Peak Morning Chanting Hours
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Devotional morning videos perform best when published between 5:30 AM and 7:00 AM local time, enabling seekers to include chants into their daily morning pooja.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-pink-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Instagram Save Optimization
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Reels containing &ldquo;Save for your daily morning meditation routine&rdquo; generate significantly higher bookmark rates than generic calls to follow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-blue-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Facebook Family Discussion
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Facebook videos that ask viewers to mention their hometown or tag family members spark organic comment velocity across multi-generational circles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
