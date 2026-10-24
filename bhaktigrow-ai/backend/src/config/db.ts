import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[Database] MongoDB connection failed:', error);
    if (env.MONGODB_URI.includes('mongodb+srv://')) {
      console.error('[Database] Atlas hint: Ensure your Network Access in MongoDB Atlas has 0.0.0.0/0 (Allow access from anywhere) enabled for hosting on Render/Vercel.');
    }
    if (env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB Disconnected');
  } catch (error) {
    console.error('[Database] MongoDB disconnection failed:', error);
  }
}
