import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserPreferences {
  theme: 'dark' | 'midnight-gold';
  preferredLanguage: string;
  defaultPlatforms: string[];
  defaultTone: string;
  reducedMotion: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'user' | 'creator' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: false,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'creator', 'admin'],
      default: 'creator'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    },
    preferences: {
      theme: { type: String, enum: ['dark', 'midnight-gold'], default: 'dark' },
      preferredLanguage: { type: String, default: 'Hindi' },
      defaultPlatforms: { type: [String], default: ['youtube', 'instagram', 'facebook'] },
      defaultTone: { type: String, default: 'Reverent' },
      reducedMotion: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

// Method to verify password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
