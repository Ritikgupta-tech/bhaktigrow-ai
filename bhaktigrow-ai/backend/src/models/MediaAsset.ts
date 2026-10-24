import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMediaAsset extends Document {
  owner: Types.ObjectId;
  storageKey: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  processingStatus: 'pending' | 'ready' | 'failed';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    storageKey: {
      type: String,
      required: true,
      unique: true
    },
    url: {
      type: String,
      required: true
    },
    originalFilename: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    processingStatus: {
      type: String,
      enum: ['pending', 'ready', 'failed'],
      default: 'ready'
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

MediaAssetSchema.index({ owner: 1, createdAt: -1 });

export const MediaAsset = mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);
