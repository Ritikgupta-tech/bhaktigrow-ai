import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment variables from .env if present
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/bhaktigrow'),
  JWT_SECRET: z.string().min(16).default('bhaktigrow_super_secure_jwt_secret_dev_32chars!'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('bhaktigrow_cookie_secret_dev'),
  AI_PROVIDER: z.enum(['gemini', 'openai', 'generative-ai', 'devotional-engine']).default('generative-ai'),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  SERPAPI_API_KEY: z.string().optional(),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default(path.resolve(process.cwd(), 'uploads')),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(500)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[Configuration Error] Invalid environment variables:');
  console.error(parsed.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
