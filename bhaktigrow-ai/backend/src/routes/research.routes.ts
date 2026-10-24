import { Router, Request, Response, NextFunction } from 'express';
import { researchService } from '../services/researchService.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

// Support both guest creators and authenticated accounts
router.use(optionalAuthenticate);

// GET /api/v1/research/trends?q=...
router.get('/trends', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = req.query.q as string | undefined;
    const result = await researchService.getDevotionalTrends(q);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/research/youtube?q=...
router.get('/youtube', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = (req.query.q as string) || 'Hanuman Chalisa';
    const result = await researchService.searchDevotionalYouTube(q);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/research/overview?q=...
router.get('/overview', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = (req.query.q as string) || 'Hanuman Chalisa';
    const [trends, youtube] = await Promise.all([
      researchService.getDevotionalTrends(q),
      researchService.searchDevotionalYouTube(q)
    ]);

    res.status(200).json({
      success: true,
      data: {
        trends,
        youtube
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
