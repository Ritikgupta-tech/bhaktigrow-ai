import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

export async function connectDB(): Promise<typeof mongoose> {
  try {
    // Ensure ipv4first for better compatibility with SRV lookups across environments
    try {
      dns.setDefaultResultOrder?.('ipv4first');
    } catch {
      // Ignore if not supported in the node runtime
    }

    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    // If SRV lookup fails on local/cloud DNS, try setting public DNS resolvers and retry once
    if (error?.message?.includes('querySrv') || error?.code === 'ECONNREFUSED') {
      try {
        console.warn('[Database] SRV query failed with system DNS. Retrying with public DNS resolvers (8.8.8.8, 1.1.1.1)...');
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(env.MONGODB_URI, {
          serverSelectionTimeoutMS: 10000
        });
        console.log(`[Database] MongoDB Connected via fallback DNS: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      } catch (retryError) {
        console.error('[Database] MongoDB connection failed on retry:', retryError);
      }
    }

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
