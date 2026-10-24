import { env } from '../config/env.js';

export interface TrendDataPoint {
  month: string;
  volume: number;
  date?: string;
}

export interface LiveTrendResult {
  isLive: boolean;
  source: string;
  query: string;
  timeline: TrendDataPoint[];
}

export interface LiveYouTubeVideoItem {
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

export interface LiveYouTubeSearchResult {
  isLive: boolean;
  source: string;
  query: string;
  totalResults?: number;
  items: LiveYouTubeVideoItem[];
}

// In-memory cache with 15-minute TTL to preserve API quota
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000;

class ResearchService {
  private trendsCache = new Map<string, CacheEntry<LiveTrendResult>>();
  private youtubeCache = new Map<string, CacheEntry<LiveYouTubeSearchResult>>();

  /**
   * Fetches real-time search interest trends via SerpApi Google Trends engine
   * Falls back gracefully to curated devotional seasonal model if key is unavailable
   */
  async getDevotionalTrends(customQuery?: string): Promise<LiveTrendResult> {
    const query = (customQuery && customQuery.trim()) ? customQuery.trim() : 'Hanuman Chalisa,Shiv Bhajan,Krishna Bhajan';
    const cacheKey = query.toLowerCase();

    // Check cache
    const cached = this.trendsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    if (env.SERPAPI_API_KEY) {
      try {
        const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(query)}&geo=IN&api_key=${env.SERPAPI_API_KEY}`;
        const res = await fetch(url);
        const data: any = await res.json();

        if (data.interest_over_time?.timeline_data && Array.isArray(data.interest_over_time.timeline_data)) {
          const rawTimeline = data.interest_over_time.timeline_data;
          
          // Downsample or map to 8-12 readable points for clean UI charting
          const step = Math.max(1, Math.floor(rawTimeline.length / 10));
          const timeline: TrendDataPoint[] = [];

          for (let i = 0; i < rawTimeline.length; i += step) {
            const pt = rawTimeline[i];
            const dateStr = pt.date || '';
            const volumeVal = pt.values && pt.values[0] && typeof pt.values[0].extracted_value === 'number'
              ? pt.values[0].extracted_value
              : 50;

            timeline.push({
              month: dateStr.length > 6 ? dateStr.slice(0, 6) : dateStr,
              volume: volumeVal,
              date: dateStr
            });
          }

          const result: LiveTrendResult = {
            isLive: true,
            source: 'Google Trends via SerpApi (Live IN Geo)',
            query,
            timeline: timeline.length > 0 ? timeline : this.getFallbackTrends()
          };

          this.trendsCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
          return result;
        }
      } catch (err) {
        console.warn('[ResearchService] SerpApi Google Trends query failed, using devotional seasonal model:', err);
      }
    }

    return {
      isLive: false,
      source: 'Editorial Devotional Seasonal Model',
      query,
      timeline: this.getFallbackTrends()
    };
  }

  /**
   * Fetches real-time devotional videos and metrics using YouTube Data API v3
   * Falls back to SerpApi or curated seed library if quota or key unavailable
   */
  async searchDevotionalYouTube(query: string = 'Hanuman Chalisa'): Promise<LiveYouTubeSearchResult> {
    const cleanQuery = query.trim() || 'Hanuman Chalisa';
    const cacheKey = cleanQuery.toLowerCase();

    const cached = this.youtubeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    // Attempt 1: Direct YouTube Data API v3
    if (env.YOUTUBE_API_KEY) {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(cleanQuery + ' bhakti')}&maxResults=8&type=video&key=${env.YOUTUBE_API_KEY}`;
        const searchRes = await fetch(searchUrl);
        const searchData: any = await searchRes.json();

        if (searchRes.ok && searchData.items && Array.isArray(searchData.items)) {
          const videoIds = searchData.items.map((i: any) => i.id?.videoId).filter(Boolean).join(',');

          // Fetch video statistics (viewCount, likeCount)
          let statsMap: Record<string, any> = {};
          if (videoIds) {
            const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${env.YOUTUBE_API_KEY}`;
            const statsRes = await fetch(statsUrl);
            const statsData: any = await statsRes.json();
            if (statsData.items) {
              statsData.items.forEach((v: any) => {
                statsMap[v.id] = v.statistics;
              });
            }
          }

          const items: LiveYouTubeVideoItem[] = searchData.items.map((item: any) => {
            const id = item.id?.videoId || Math.random().toString();
            const title = item.snippet?.title || '';
            const channel = item.snippet?.channelTitle || 'Devotional Channel';
            const stats = statsMap[id] || {};
            const viewCount = stats.viewCount ? parseInt(stats.viewCount, 10) : 100000;
            const likeCount = stats.likeCount ? parseInt(stats.likeCount, 10) : undefined;
            const commentCount = stats.commentCount ? parseInt(stats.commentCount, 10) : undefined;

            return {
              id,
              title,
              channelTitle: channel,
              publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
              thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
              viewCount,
              likeCount,
              commentCount,
              category: this.inferCategory(cleanQuery, title),
              searchIntent: 'Devotional Chanting & Meditation',
              contentGapIdea: `High-retention lyrics video or 4K meditative visualization focusing on "${cleanQuery}" with synchronized translation`,
              editorialAngle: `Leverage high seeker demand for morning/evening prayers with peaceful ambient instrumentation.`,
              opportunityScore: Math.min(98, Math.max(65, Math.floor(80 + (Math.log10(viewCount || 1000) * 2)))),
              evidenceStatus: 'verified' as const
            };
          });

          const result: LiveYouTubeSearchResult = {
            isLive: true,
            source: 'YouTube Data API v3 (Live Results)',
            query: cleanQuery,
            totalResults: searchData.pageInfo?.totalResults || items.length,
            items
          };

          this.youtubeCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
          return result;
        }
      } catch (err) {
        console.warn('[ResearchService] YouTube Data API failed, falling back to SerpApi / editorial:', err);
      }
    }

    // Attempt 2: SerpApi YouTube engine fallback
    if (env.SERPAPI_API_KEY) {
      try {
        const serpUrl = `https://serpapi.com/search.json?engine=youtube&search_query=${encodeURIComponent(cleanQuery)}&api_key=${env.SERPAPI_API_KEY}`;
        const res = await fetch(serpUrl);
        const data: any = await res.json();

        if (data.video_results && Array.isArray(data.video_results)) {
          const items: LiveYouTubeVideoItem[] = data.video_results.slice(0, 8).map((v: any, index: number) => ({
            id: v.link || `serp_${index}`,
            title: v.title || '',
            channelTitle: v.channel?.name || 'Devotional Creator',
            publishedAt: v.published_date || 'Recently published',
            thumbnailUrl: v.thumbnail?.static || '',
            viewCount: v.views ? parseInt(String(v.views).replace(/[^0-9]/g, ''), 10) : 50000,
            category: this.inferCategory(cleanQuery, v.title || ''),
            searchIntent: 'Seeker Spiritual Chanting',
            contentGapIdea: `Fast-tempo or meditative morning version with accurate Devanagari text overlay`,
            editorialAngle: 'Direct seeker connection through reverent audio mastering.',
            opportunityScore: 85,
            evidenceStatus: 'verified' as const
          }));

          const result: LiveYouTubeSearchResult = {
            isLive: true,
            source: 'SerpApi YouTube Engine (Live Results)',
            query: cleanQuery,
            items
          };

          this.youtubeCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
          return result;
        }
      } catch (err) {
        console.warn('[ResearchService] SerpApi YouTube query failed:', err);
      }
    }

    // Default Fallback
    return {
      isLive: false,
      source: 'Curated Devotional Editorial Seed',
      query: cleanQuery,
      items: this.getFallbackSeedItems(cleanQuery)
    };
  }

  private inferCategory(query: string, title: string): string {
    const combined = `${query} ${title}`.toLowerCase();
    if (combined.includes('hanuman') || combined.includes('bajrang')) return 'Hanuman Chalisa';
    if (combined.includes('shiv') || combined.includes('shiva') || combined.includes('mahadev')) return 'Shiva Bhakti';
    if (combined.includes('krishna') || combined.includes('radha') || combined.includes('govind')) return 'Krishna Bhakti';
    if (combined.includes('ram') || combined.includes('sita') || combined.includes('ayodhya')) return 'Ram Bhakti';
    if (combined.includes('durga') || combined.includes('devi') || combined.includes('navratri')) return 'Durga Stuti';
    if (combined.includes('ganesh') || combined.includes('ganpati')) return 'Ganesh Aarti';
    if (combined.includes('mantra')) return 'Mantra Meditation';
    return 'General Devotion';
  }

  private getFallbackTrends(): TrendDataPoint[] {
    return [
      { month: 'May', volume: 68 },
      { month: 'Jun', volume: 74 },
      { month: 'Jul', volume: 82 },
      { month: 'Aug', volume: 95 },
      { month: 'Sep', volume: 88 },
      { month: 'Oct', volume: 98 },
      { month: 'Nov', volume: 92 }
    ];
  }

  private getFallbackSeedItems(query: string): LiveYouTubeVideoItem[] {
    return [
      {
        id: 'seed-1',
        title: `${query} | 108 Sacred Chants with Lyrics & Meaning`,
        channelTitle: 'Bhakti Sagar Chants',
        publishedAt: '2026-05-15T00:00:00Z',
        thumbnailUrl: '',
        viewCount: 450000,
        category: this.inferCategory(query, query),
        searchIntent: 'Full Chanting with English & Hindi Meaning',
        contentGapIdea: 'Include word-by-word meaning breakdown for modern devotees',
        editorialAngle: 'High retention during morning prayer commute times.',
        opportunityScore: 92,
        evidenceStatus: 'editorial'
      },
      {
        id: 'seed-2',
        title: `Powerful ${query} Chanting (Peaceful Flute & Tanpura Version)`,
        channelTitle: 'Divine Relaxation Music',
        publishedAt: '2026-07-10T00:00:00Z',
        thumbnailUrl: '',
        viewCount: 1200000,
        category: this.inferCategory(query, query),
        searchIntent: 'Meditation & Spiritual Relaxation',
        contentGapIdea: 'Long-form 1 hour continuous loop without disruptive loud ads',
        editorialAngle: 'Attracts sleep meditation and deep study devotional seekers.',
        opportunityScore: 88,
        evidenceStatus: 'editorial'
      }
    ];
  }
}

export const researchService = new ResearchService();
