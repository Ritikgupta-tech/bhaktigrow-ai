import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISavedSuggestion extends Document {
  owner: Types.ObjectId;
  suggestionId: string;
  platform: 'youtube' | 'instagram' | 'facebook';
  category: string;
  strategy: string;
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
  evidenceStatus: string;
  pinnedComment?: string;
  tags?: string[];
  onScreenText?: string;
  subtitleGuidance?: string;
  reelCoverText?: string;
  communityAngle?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SavedSuggestionSchema = new Schema<ISavedSuggestion>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    suggestionId: {
      type: String,
      required: true,
      index: true
    },
    platform: {
      type: String,
      enum: ['youtube', 'instagram', 'facebook'],
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true
    },
    strategy: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    hook: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    hashtags: {
      type: [String],
      default: []
    },
    searchKeywords: {
      type: [String],
      default: []
    },
    thumbnailIdea: {
      type: String,
      default: ''
    },
    thumbnailHeadline: {
      type: String,
      default: ''
    },
    cta: {
      type: String,
      default: ''
    },
    targetAudience: {
      type: String,
      default: ''
    },
    contentFormat: {
      type: String,
      default: ''
    },
    editorialRationale: {
      type: String,
      default: ''
    },
    evidenceStatus: {
      type: String,
      default: 'editorial'
    },
    pinnedComment: { type: String },
    tags: { type: [String], default: [] },
    onScreenText: { type: String },
    subtitleGuidance: { type: String },
    reelCoverText: { type: String },
    communityAngle: { type: String },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate saved suggestion records per user
SavedSuggestionSchema.index({ owner: 1, suggestionId: 1 }, { unique: true });
SavedSuggestionSchema.index({ owner: 1, platform: 1 });

export const SavedSuggestion = mongoose.model<ISavedSuggestion>('SavedSuggestion', SavedSuggestionSchema);
