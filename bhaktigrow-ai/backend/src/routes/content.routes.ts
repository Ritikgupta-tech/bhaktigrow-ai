import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ContentDraft } from '../models/ContentDraft.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createDraftSchema = z.object({
  body: z.object({
    platform: z.enum(['youtube', 'instagram', 'facebook']),
    contentType: z.string().default('Video'),
    topic: z.string().min(1, 'Topic is required'),
    category: z.string().min(1, 'Category is required'),
    language: z.string().default('Hindi'),
    tone: z.string().default('Reverent'),
    generatedTitle: z.string().min(1, 'Generated title is required'),
    caption: z.string().min(1, 'Caption is required'),
    hook: z.string().optional(),
    script: z.string().optional(),
    hashtags: z.array(z.string()).default([]),
    searchKeywords: z.array(z.string()).default([]),
    callToAction: z.string().default(''),
    thumbnailIdea: z.string().optional(),
    thumbnailHeadline: z.string().optional(),
    strategy: z.string().default('search-seo'),
    evidenceStatus: z.enum(['verified', 'calculated', 'editorial', 'illustrative']).default('editorial'),
    status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
    metadata: z.record(z.unknown()).optional()
  })
});

const updateDraftSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    generatedTitle: z.string().optional(),
    caption: z.string().optional(),
    hook: z.string().optional(),
    script: z.string().optional(),
    hashtags: z.array(z.string()).optional(),
    searchKeywords: z.array(z.string()).optional(),
    callToAction: z.string().optional(),
    thumbnailIdea: z.string().optional(),
    thumbnailHeadline: z.string().optional(),
    status: z.enum(['draft', 'scheduled', 'published']).optional(),
    metadata: z.record(z.unknown()).optional()
  })
});

// All routes require authentication
router.use(authenticate);

// GET /api/v1/content
router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { platform, status, search, page = '1', limit = '20' } = req.query;
    const query: Record<string, unknown> = { owner: req.user!._id };

    if (platform && platform !== 'all') {
      query.platform = platform;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && typeof search === 'string') {
      query.$or = [
        { topic: { $regex: search, $options: 'i' } },
        { generatedTitle: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      ContentDraft.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limitNum),
      ContentDraft.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/content
router.post(
  '/',
  validate(createDraftSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const draft = await ContentDraft.create({
        ...req.body,
        owner: req.user!._id
      });

      res.status(201).json({
        success: true,
        message: 'Content draft created successfully.',
        data: draft
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/content/:id
router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const draft = await ContentDraft.findOne({
      _id: req.params.id,
      owner: req.user!._id
    });

    if (!draft) {
      res.status(404).json({ success: false, message: 'Draft not found.' });
      return;
    }

    res.status(200).json({ success: true, data: draft });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/content/:id
router.patch(
  '/:id',
  validate(updateDraftSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const draft = await ContentDraft.findOneAndUpdate(
        { _id: req.params.id, owner: req.user!._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!draft) {
        res.status(404).json({ success: false, message: 'Draft not found or unauthorized.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Draft updated successfully.',
        data: draft
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/content/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const draft = await ContentDraft.findOneAndDelete({
      _id: req.params.id,
      owner: req.user!._id
    });

    if (!draft) {
      res.status(404).json({ success: false, message: 'Draft not found or unauthorized.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Draft deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
