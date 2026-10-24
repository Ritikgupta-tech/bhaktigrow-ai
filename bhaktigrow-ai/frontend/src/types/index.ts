export type Platform = 'youtube' | 'instagram' | 'facebook';

export type StrategyType = 
  | 'search-seo' 
  | 'curiosity-hook' 
  | 'emotional-story' 
  | 'community-engagement' 
  | 'calm-meditative';

export type EvidenceStatus = 'verified' | 'calculated' | 'editorial' | 'illustrative';

export type DevotionalCategory =
  | 'Hanuman Chalisa'
  | 'Shiva Mantra'
  | 'Krishna Bhajan'
  | 'Ram Bhakti'
  | 'Durga Stuti'
  | 'Ganesh Aarti'
  | 'Gayatri Mantra'
  | 'Vishnu Mantra'
  | 'Meditation'
  | 'Devotional Stories'
  | 'Morning Prayers'
  | 'Evening Aarti'
  | 'Other';

export type ContentFormat =
  | 'YouTube Long-form'
  | 'YouTube Shorts'
  | 'Instagram Reel'
  | 'Instagram Feed Video'
  | 'Facebook Reel'
  | 'Facebook Video';

export type ContentTone =
  | 'Reverent'
  | 'Uplifting'
  | 'Peaceful/Meditative'
  | 'Story-driven'
  | 'Inspirational'
  | 'Traditional';

export type ContentLanguage = 'Hindi' | 'English' | 'Sanskrit' | 'Hinglish' | 'Other';

export interface Suggestion {
  id: string;
  platform: Platform;
  strategy: StrategyType;
  strategyLabel: string;
  title: string;
  hook: string;
  description: string;
  hashtags: string[];
  searchKeywords: string[];
  thumbnailIdea: string;
  thumbnailHeadline: string;
  cta: string;
  targetAudience: string;
  contentFormat: string;
  editorialRationale: string;
  evidenceStatus: EvidenceStatus;
  pinnedComment?: string;
  tags?: string[];
  onScreenText?: string;
  subtitleGuidance?: string;
  reelCoverText?: string;
  communityAngle?: string;
  createdAt: string;
}

export interface StudioFormInput {
  videoTitle: string;
  videoDescription?: string;
  transcript?: string;
  language: ContentLanguage;
  category: DevotionalCategory;
  targetAudience: string;
  videoFormat: ContentFormat;
  platforms: Platform[];
  primaryKeywords: string;
  secondaryKeywords?: string;
  tone: ContentTone;
  videoFileName?: string;
  videoFileSize?: number;
  videoFileUrl?: string | null;
}

export interface SuggestionProvider {
  generate(input: StudioFormInput, platform: Platform): Suggestion[];
  regenerate(suggestionId: string, currentSuggestions: Suggestion[], input: StudioFormInput): Suggestion;
}

export interface ResearchItem {
  id: string;
  term: string;
  category: DevotionalCategory;
  platform: Platform | 'all';
  language: ContentLanguage;
  searchIntent: 'Informational' | 'Devotional Practice' | 'Meditation' | 'Ritual / Pooja';
  contentGapIdea: string;
  editorialAngle: string;
  suggestedConcept: string;
  evidenceStatus: EvidenceStatus;
  sourceUrl: string | null;
  retrievedAt: string | null;
  sampleVolumeScore: number; // 0-100 illustrative scale
}

export interface LibraryItem {
  id: string;
  topic: string;
  category: DevotionalCategory;
  potentialAudience: string;
  suggestedFormat: ContentFormat;
  searchKeywords: string[];
  creativeAngle: string;
  suggestedHook: string;
  sampleDescription: string;
  saved?: boolean;
}

export type CalendarStatus = 'Draft' | 'Scheduled Demo' | 'Published Demo';

export interface CalendarEntry {
  id: string;
  title: string;
  platform: Platform;
  category: DevotionalCategory;
  plannedDateTime: string; // ISO string
  status: CalendarStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'midnight-gold';
  preferredLanguage: ContentLanguage;
  defaultPlatforms: Platform[];
  defaultTone: ContentTone;
  reducedMotion: boolean;
}
