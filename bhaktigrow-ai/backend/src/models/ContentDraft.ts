import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContentDraft extends Document {
  owner: Types.ObjectId;
  platform: 'youtube' | 'instagram' | 'facebook';
  contentType: string;
  topic: string;
  category: string;
  language: string;
  tone: string;
  generatedTitle: string;
  caption: string;
  hook?: string;
  script?: string;
  hashtags: string[];
  searchKeywords: string[];
  callToAction: string;
  thumbnailIdea?: string;
  thumbnailHeadline?: string;
  strategy?: string;
  evidenceStatus: string;
  status: 'draft' | 'scheduled' | 'published';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ContentDraftSchema = new Schema<IContentDraft>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    platform: {
      type: String,
      enum: ['youtube', 'instagram', 'facebook'],
      required: true,
      index: true
    },
    contentType: {
      type: String,
      required: true,
      default: 'Video'
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      default: 'Hindi'
    },
    tone: {
      type: String,
      default: 'Reverent'
    },
    generatedTitle: {
      type: String,
      required: true,
      trim: true
    },
    caption: {
      type: String,
      required: true
    },
    hook: {
      type: String,
      default: ''
    },
    script: {
      type: String,
      default: ''
    },
    hashtags: {
      type: [String],
      default: []
    },
    searchKeywords: {
      type: [String],
      default: []
    },
    callToAction: {
      type: String,
      default: ''
    },
    thumbnailIdea: {
      type: String,
      default: ''
    },
    thumbnailHeadline: {
      type: String,
      default: ''
    },
    strategy: {
      type: String,
      default: 'search-seo'
    },
    evidenceStatus: {
      type: String,
      enum: ['verified', 'calculated', 'editorial', 'illustrative'],
      default: 'editorial'
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published'],
      default: 'draft',
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying user drafts by platform & status
ContentDraftSchema.index({ owner: 1, platform: 1, status: 1 });

export const ContentDraft = mongoose.model<IContentDraft>('ContentDraft', ContentDraftSchema);
