import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'BhaktiGrow AI API',
    version: '1.0.0'
  });
});

router.get('/ready', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const isReady = dbState === 1; // 1 = connected

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'unavailable',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
