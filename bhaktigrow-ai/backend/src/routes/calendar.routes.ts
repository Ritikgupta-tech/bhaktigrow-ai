import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ContentSchedule } from '../models/ContentSchedule.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createScheduleSchema = z.object({
  body: z.object({
    draftId: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    platform: z.enum(['youtube', 'instagram', 'facebook']),
    category: z.string().min(1, 'Category is required'),
    scheduledDateTime: z.string().datetime().or(z.string().min(1)),
    timezone: z.string().default('Asia/Kolkata'),
    status: z.enum(['Draft', 'Scheduled Demo', 'Published Demo']).default('Draft'),
    notes: z.string().optional()
  })
});

const updateScheduleSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().optional(),
    platform: z.enum(['youtube', 'instagram', 'facebook']).optional(),
    category: z.string().optional(),
    scheduledDateTime: z.string().optional(),
    status: z.enum(['Draft', 'Scheduled Demo', 'Published Demo']).optional(),
    notes: z.string().optional()
  })
});

router.use(authenticate);

// GET /api/v1/calendar
router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { platform, status, search, from, to } = req.query;
    const query: Record<string, unknown> = { owner: req.user!._id };

    if (platform && platform !== 'all') {
      query.platform = platform;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && typeof search === 'string') {
      query.title = { $regex: search, $options: 'i' };
    }
    if (from || to) {
      query.scheduledDateTime = {};
      if (from) (query.scheduledDateTime as Record<string, Date>).$gte = new Date(from as string);
      if (to) (query.scheduledDateTime as Record<string, Date>).$lte = new Date(to as string);
    }

    let items = await ContentSchedule.find(query).sort({ scheduledDateTime: 1 });

    // If new user has 0 entries, auto-seed realistic demo devotional schedule
    if (items.length === 0 && !search && !platform && !status) {
      const now = Date.now();
      const seedEntries = [
        {
          owner: req.user!._id,
          title: 'Tuesday Morning Hanuman Chalisa (11 Chants)',
          platform: 'youtube',
          category: 'Hanuman Chalisa',
          scheduledDateTime: new Date(now + 86400000 * 1),
          status: 'Scheduled Demo',
          notes: 'Include Sanskrit subtitles and mala bead visual counter.'
        },
        {
          owner: req.user!._id,
          title: 'Instagram Reel: 30-Sec Shiva Serenity Loop',
          platform: 'instagram',
          category: 'Shiva Mantra',
          scheduledDateTime: new Date(now + 86400000 * 2),
          status: 'Draft',
          notes: 'Focus on calming 432Hz bell chimes and subtle mandala animation.'
        },
        {
          owner: req.user!._id,
          title: 'Facebook Family Aarti: Jai Ganesh Deva',
          platform: 'facebook',
          category: 'Ganesh Aarti',
          scheduledDateTime: new Date(now + 86400000 * 3),
          status: 'Draft',
          notes: 'Large Devanagari lyrics overlay for family singalong.'
        }
      ];

      items = await ContentSchedule.insertMany(seedEntries) as any;
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/calendar
router.post(
  '/',
  validate(createScheduleSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entry = await ContentSchedule.create({
        ...req.body,
        scheduledDateTime: new Date(req.body.scheduledDateTime),
        owner: req.user!._id
      });

      res.status(201).json({
        success: true,
        message: 'Content scheduled successfully in calendar.',
        data: entry
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/calendar/:id
router.patch(
  '/:id',
  validate(updateScheduleSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updates = { ...req.body };
      if (updates.scheduledDateTime) {
        updates.scheduledDateTime = new Date(updates.scheduledDateTime);
      }

      const entry = await ContentSchedule.findOneAndUpdate(
        { _id: req.params.id, owner: req.user!._id },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!entry) {
        res.status(404).json({ success: false, message: 'Calendar entry not found or unauthorized.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Calendar entry updated.',
        data: entry
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/calendar/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const entry = await ContentSchedule.findOneAndDelete({
      _id: req.params.id,
      owner: req.user!._id
    });

    if (!entry) {
      res.status(404).json({ success: false, message: 'Calendar entry not found or unauthorized.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Calendar entry deleted.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
