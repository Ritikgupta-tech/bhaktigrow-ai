import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { SavedSuggestion } from '../models/SavedSuggestion.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createSuggestionSchema = z.object({
  body: z.object({
    suggestionId: z.string().min(1),
    platform: z.enum(['youtube', 'instagram', 'facebook']),
    category: z.string().default('General Devotion'),
    strategy: z.string().default('search-seo'),
    title: z.string().min(1),
    hook: z.string().default(''),
    description: z.string().min(1),
    hashtags: z.array(z.string()).default([]),
    searchKeywords: z.array(z.string()).default([]),
    thumbnailIdea: z.string().default(''),
    thumbnailHeadline: z.string().default(''),
    cta: z.string().default(''),
    targetAudience: z.string().default(''),
    contentFormat: z.string().default(''),
    editorialRationale: z.string().default(''),
    evidenceStatus: z.string().default('editorial'),
    pinnedComment: z.string().optional(),
    tags: z.array(z.string()).optional(),
    onScreenText: z.string().optional(),
    subtitleGuidance: z.string().optional(),
    reelCoverText: z.string().optional(),
    communityAngle: z.string().optional(),
    isFavorite: z.boolean().default(false)
  })
});

const updateSuggestionSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().optional(),
    hook: z.string().optional(),
    description: z.string().optional(),
    cta: z.string().optional(),
    isFavorite: z.boolean().optional()
  })
});

router.use(authenticate);

// GET /api/v1/suggestions
router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { platform, search } = req.query;
    const query: Record<string, unknown> = { owner: req.user!._id };

    if (platform && platform !== 'all') {
      query.platform = platform;
    }
    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { hook: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { searchKeywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const items = await SavedSuggestion.find(query).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/suggestions
router.post(
  '/',
  validate(createSuggestionSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const existing = await SavedSuggestion.findOne({
        owner: req.user!._id,
        suggestionId: req.body.suggestionId
      });

      if (existing) {
        res.status(200).json({
          success: true,
          message: 'Suggestion already bookmarked.',
          data: existing
        });
        return;
      }

      const created = await SavedSuggestion.create({
        ...req.body,
        owner: req.user!._id
      });

      res.status(201).json({
        success: true,
        message: 'Suggestion saved to collection.',
        data: created
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/suggestions/:id
router.patch(
  '/:id',
  validate(updateSuggestionSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isMongoId = mongoose.Types.ObjectId.isValid(req.params.id);
      const query = isMongoId
        ? { $or: [{ _id: req.params.id }, { suggestionId: req.params.id }], owner: req.user!._id }
        : { suggestionId: req.params.id, owner: req.user!._id };

      const item = await SavedSuggestion.findOneAndUpdate(
        query,
        { $set: req.body },
        { new: true }
      );

      if (!item) {
        res.status(404).json({ success: false, message: 'Saved suggestion not found or unauthorized.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Saved suggestion updated.',
        data: item
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/suggestions/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isMongoId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isMongoId
      ? { $or: [{ _id: req.params.id }, { suggestionId: req.params.id }], owner: req.user!._id }
      : { suggestionId: req.params.id, owner: req.user!._id };

    const item = await SavedSuggestion.findOneAndDelete(query);

    if (!item) {
      res.status(404).json({ success: false, message: 'Saved suggestion not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Removed from saved collection.'
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/suggestions (Clear All)
router.delete('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await SavedSuggestion.deleteMany({ owner: req.user!._id });
    res.status(200).json({
      success: true,
      message: 'All saved suggestions cleared.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
