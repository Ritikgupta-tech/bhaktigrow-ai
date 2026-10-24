import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { aiService } from '../services/aiService.js';
import { validate } from '../middleware/validate.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

const generateSchema = z.object({
  body: z.object({
    videoTitle: z.string().min(1, 'Video title / topic is required'),
    category: z.string().min(1, 'Category is required'),
    language: z.string().optional(),
    tone: z.string().optional(),
    videoFormat: z.string().optional(),
    platforms: z.array(z.enum(['youtube', 'instagram', 'facebook'])).min(1, 'At least one platform is required'),
    primaryKeywords: z.string().optional(),
    secondaryKeywords: z.string().optional(),
    targetAudience: z.string().optional(),
    transcript: z.string().optional()
  })
});

const regenerateSchema = z.object({
  body: z.object({
    suggestionId: z.string().min(1, 'Suggestion ID is required'),
    currentSuggestions: z.array(z.any()).min(1),
    input: z.object({
      videoTitle: z.string(),
      category: z.string(),
      language: z.string().optional(),
      tone: z.string().optional(),
      videoFormat: z.string().optional(),
      platforms: z.array(z.enum(['youtube', 'instagram', 'facebook'])),
      primaryKeywords: z.string().optional(),
      secondaryKeywords: z.string().optional(),
      targetAudience: z.string().optional()
    })
  })
});

const hashtagsSchema = z.object({
  body: z.object({
    category: z.string().min(1),
    topic: z.string().default('Devotional Chants'),
    platform: z.enum(['youtube', 'instagram', 'facebook']).default('instagram')
  })
});

const repurposeSchema = z.object({
  body: z.object({
    sourceContent: z.string().min(1, 'Source content is required'),
    targetPlatform: z.enum(['youtube', 'instagram', 'facebook'])
  })
});

// AI Generation routes support optional auth so guest demo mode still works, but authenticated users get personalized logging
router.use(optionalAuthenticate);

// POST /api/v1/ai/generate
router.post(
  '/generate',
  validate(generateSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const suggestions = await aiService.generate(req.body);
      res.status(200).json({
        success: true,
        provider: aiService.getProviderName(),
        count: suggestions.length,
        data: suggestions
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/ai/regenerate
router.post(
  '/regenerate',
  validate(regenerateSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { suggestionId, currentSuggestions, input } = req.body;
      const updated = await aiService.regenerate(suggestionId, currentSuggestions, input);
      res.status(200).json({
        success: true,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/ai/hashtags
router.post(
  '/hashtags',
  validate(hashtagsSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category, topic, platform } = req.body;
      const hashtags = await aiService.generateHashtags(category, topic, platform);
      res.status(200).json({
        success: true,
        data: hashtags
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/ai/repurpose
router.post(
  '/repurpose',
  validate(repurposeSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sourceContent, targetPlatform } = req.body;
      const repurposed = await aiService.repurpose(sourceContent, targetPlatform);
      res.status(200).json({
        success: true,
        data: repurposed
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
