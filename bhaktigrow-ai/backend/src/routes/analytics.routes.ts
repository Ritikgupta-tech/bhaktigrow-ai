import { Router, Response, NextFunction } from 'express';
import { ContentDraft } from '../models/ContentDraft.js';
import { SavedSuggestion } from '../models/SavedSuggestion.js';
import { ContentSchedule } from '../models/ContentSchedule.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/v1/analytics/overview
router.get('/overview', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = req.user!._id;

    const [
      totalDrafts,
      totalSaved,
      totalScheduled,
      totalPublished,
      ytCount,
      igCount,
      fbCount,
      schedules
    ] = await Promise.all([
      ContentDraft.countDocuments({ owner: ownerId, status: 'draft' }),
      SavedSuggestion.countDocuments({ owner: ownerId }),
      ContentSchedule.countDocuments({ owner: ownerId, status: 'Scheduled Demo' }),
      ContentSchedule.countDocuments({ owner: ownerId, status: 'Published Demo' }),
      ContentSchedule.countDocuments({ owner: ownerId, platform: 'youtube' }),
      ContentSchedule.countDocuments({ owner: ownerId, platform: 'instagram' }),
      ContentSchedule.countDocuments({ owner: ownerId, platform: 'facebook' }),
      ContentSchedule.find({ owner: ownerId }).select('category platform status plannedDateTime')
    ]);

    // Calculate category distribution from schedules
    const categoryCounts: Record<string, number> = {};
    schedules.forEach(s => {
      const cat = s.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }));

    // Platform share data
    const platformDistribution = [
      { name: 'YouTube', value: ytCount || 1, color: '#ef4444' },
      { name: 'Instagram', value: igCount || 1, color: '#ec4899' },
      { name: 'Facebook', value: fbCount || 1, color: '#3b82f6' }
    ];

    // Illustrative strategy benchmarks
    const strategyBenchmarks = [
      { strategy: 'Search SEO', saves: 88, comments: 45, shares: 62 },
      { strategy: 'Curiosity Hook', saves: 72, comments: 94, shares: 85 },
      { strategy: 'Emotional Story', saves: 91, comments: 98, shares: 92 },
      { strategy: 'Community Satsang', saves: 65, comments: 100, shares: 79 },
      { strategy: 'Meditative Peace', saves: 96, comments: 60, shares: 88 }
    ];

    res.status(200).json({
      success: true,
      data: {
        summary: {
          drafts: totalDrafts,
          saved: totalSaved,
          scheduled: totalScheduled,
          published: totalPublished,
          totalPlanned: schedules.length
        },
        platformDistribution,
        categoryDistribution,
        strategyBenchmarks,
        disclaimer: 'Summary metrics derived from active database records. Strategy benchmarks represent qualitative devotional models.'
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
