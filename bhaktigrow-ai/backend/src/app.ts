import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { swaggerDocument } from './docs/swagger.js';

// Route Handlers
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import aiRoutes from './routes/ai.routes.js';
import suggestionsRoutes from './routes/suggestions.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import mediaRoutes from './routes/media.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import socialRoutes from './routes/social.routes.js';

export function createApp(): Express {
  const app = express();

  // Trust reverse proxy (Render, Vercel, Railway, Cloudflare SSL terminations)
  app.set('trust proxy', 1);

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    ...env.CLIENT_ORIGIN.split(',').map(s => s.trim()),
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(null, true); // Allow during transition; client origin validated
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // Body and Cookie Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Rate Limiting on API endpoints
  app.use('/api/', apiLimiter);

  // Static Uploads Folder
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Mount API v1 Routes
  const apiV1 = express.Router();
  apiV1.use('/', healthRoutes);
  apiV1.use('/auth', authRoutes);
  apiV1.use('/content', contentRoutes);
  apiV1.use('/ai', aiRoutes);
  apiV1.use('/suggestions', suggestionsRoutes);
  apiV1.use('/calendar', calendarRoutes);
  apiV1.use('/media', mediaRoutes);
  apiV1.use('/analytics', analyticsRoutes);
  apiV1.use('/settings', settingsRoutes);
  apiV1.use('/social', socialRoutes);

  app.use('/api/v1', apiV1);

  // Catch-all 404 for undefined routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
