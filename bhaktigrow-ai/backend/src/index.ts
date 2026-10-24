import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Initialize Express App
    const app = createApp();

    // 3. Start Server
    const server = app.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 BhaktiGrow AI Server Running on http://localhost:${env.PORT}`);
      console.log(`📖 API Documentation: http://localhost:${env.PORT}/api/docs`);
      console.log(`🌿 Environment: ${env.NODE_ENV} | AI Provider: ${env.AI_PROVIDER}`);
      console.log(`=======================================================`);
    });

    // Graceful Shutdown
    const handleShutdown = (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (err) {
    console.error('[Bootstrap Error] Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
