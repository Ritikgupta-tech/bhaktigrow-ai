import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISocialAccount extends Document {
  owner: Types.ObjectId;
  platform: 'youtube' | 'instagram' | 'facebook';
  externalAccountId?: string;
  accountName?: string;
  avatarUrl?: string;
  encryptedAccessToken?: string;
  encryptedRefreshToken?: string;
  permissionStatus: 'connected' | 'disconnected' | 'pending_approval' | 'error';
  tokenExpiresAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SocialAccountSchema = new Schema<ISocialAccount>(
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
    externalAccountId: {
      type: String,
      trim: true
    },
    accountName: {
      type: String,
      trim: true
    },
    avatarUrl: {
      type: String
    },
    encryptedAccessToken: {
      type: String,
      select: false
    },
    encryptedRefreshToken: {
      type: String,
      select: false
    },
    permissionStatus: {
      type: String,
      enum: ['connected', 'disconnected', 'pending_approval', 'error'],
      default: 'disconnected',
      index: true
    },
    tokenExpiresAt: {
      type: Date
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

// Unique compound index: one account per platform per user
SocialAccountSchema.index({ owner: 1, platform: 1 }, { unique: true });

export const SocialAccount = mongoose.model<ISocialAccount>('SocialAccount', SocialAccountSchema);
