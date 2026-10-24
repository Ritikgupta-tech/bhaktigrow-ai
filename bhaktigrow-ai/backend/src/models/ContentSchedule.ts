import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContentSchedule extends Document {
  owner: Types.ObjectId;
  draftId?: Types.ObjectId;
  title: string;
  platform: 'youtube' | 'instagram' | 'facebook';
  category: string;
  scheduledDateTime: Date;
  timezone: string;
  status: 'Draft' | 'Scheduled Demo' | 'Published Demo';
  notes?: string;
  publicationResult?: {
    publishedAt?: Date;
    externalPostId?: string;
    url?: string;
    error?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ContentScheduleSchema = new Schema<IContentSchedule>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    draftId: {
      type: Schema.Types.ObjectId,
      ref: 'ContentDraft'
    },
    title: {
      type: String,
      required: true,
      trim: true
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
    scheduledDateTime: {
      type: Date,
      required: true,
      index: true
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    status: {
      type: String,
      enum: ['Draft', 'Scheduled Demo', 'Published Demo'],
      default: 'Draft',
      index: true
    },
    notes: {
      type: String,
      default: ''
    },
    publicationResult: {
      publishedAt: Date,
      externalPostId: String,
      url: String,
      error: String
    }
  },
  {
    timestamps: true
  }
);

ContentScheduleSchema.index({ owner: 1, scheduledDateTime: 1 });
ContentScheduleSchema.index({ owner: 1, status: 1 });

export const ContentSchedule = mongoose.model<IContentSchedule>('ContentSchedule', ContentScheduleSchema);
