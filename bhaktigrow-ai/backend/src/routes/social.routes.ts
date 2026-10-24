import { Router, Request, Response, NextFunction } from 'express';
import { socialService } from '../services/socialService.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/v1/social/status
router.get('/status', (_req: Request, res: Response) => {
  const yt = socialService.getIntegrationStatus('youtube');
  const ig = socialService.getIntegrationStatus('instagram');
  const fb = socialService.getIntegrationStatus('facebook');

  res.status(200).json({
    success: true,
    data: {
      youtube: yt,
      instagram: ig,
      facebook: fb
    }
  });
});

// POST /api/v1/social/publish/:scheduleId
router.post('/publish/:scheduleId', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { platform = 'youtube' } = req.body;
    const result = await socialService.publishScheduledPost(req.params.scheduleId, platform);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

export default router;
