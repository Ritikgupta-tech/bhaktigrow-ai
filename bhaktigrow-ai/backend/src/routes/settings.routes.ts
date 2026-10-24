import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { ContentDraft } from '../models/ContentDraft.js';
import { SavedSuggestion } from '../models/SavedSuggestion.js';
import { ContentSchedule } from '../models/ContentSchedule.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const updateSettingsSchema = z.object({
  body: z.object({
    theme: z.enum(['dark', 'midnight-gold']).optional(),
    preferredLanguage: z.string().optional(),
    defaultPlatforms: z.array(z.string()).optional(),
    defaultTone: z.string().optional(),
    reducedMotion: z.boolean().optional()
  })
});

router.use(authenticate);

// GET /api/v1/settings
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user!.preferences
  });
});

// PATCH /api/v1/settings
router.patch(
  '/',
  validate(updateSettingsSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.user!._id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      user.preferences = {
        ...user.preferences,
        ...req.body
      };

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully.',
        data: user.preferences
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/settings/reset (Wipes user's demo data and resets preferences)
router.post('/reset', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = req.user!._id;

    await Promise.all([
      ContentDraft.deleteMany({ owner: ownerId }),
      SavedSuggestion.deleteMany({ owner: ownerId }),
      ContentSchedule.deleteMany({ owner: ownerId }),
      User.findByIdAndUpdate(ownerId, {
        preferences: {
          theme: 'dark',
          preferredLanguage: 'Hindi',
          defaultPlatforms: ['youtube', 'instagram', 'facebook'],
          defaultTone: 'Reverent',
          reducedMotion: false
        }
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'All user data has been reset to default state.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
