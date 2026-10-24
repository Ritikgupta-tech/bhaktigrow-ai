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

export type UserRole = 'user' | 'creator' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  preferences: {
    theme: 'dark' | 'midnight-gold';
    preferredLanguage: ContentLanguage;
    defaultPlatforms: Platform[];
    defaultTone: ContentTone;
    reducedMotion: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SuggestionDTO {
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
  isFavorite?: boolean;
  createdAt: string;
}

export type ScheduleStatus = 'Draft' | 'Scheduled Demo' | 'Published Demo';

export interface CalendarEntryDTO {
  id: string;
  title: string;
  platform: Platform;
  category: DevotionalCategory;
  plannedDateTime: string;
  status: ScheduleStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
