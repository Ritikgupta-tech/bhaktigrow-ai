import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { MediaAsset } from '../models/MediaAsset.js';
import { storageService } from '../services/storageService.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { env } from '../config/env.js';

const router = Router();

// Multer storage in memory or temp disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 // 500 MB
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.mp4', '.webm', '.mov', '.jpg', '.jpeg', '.png'];
    if (!allowedExts.includes(ext)) {
      cb(new Error(`File type not allowed. Supported formats: ${allowedExts.join(', ')}`));
      return;
    }
    cb(null, true);
  }
});

router.use(authenticate);

// POST /api/v1/media/upload
router.post(
  '/upload',
  upload.single('video'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No media file provided.' });
        return;
      }

      const saved = storageService.saveLocalFile(req.file);

      const asset = await MediaAsset.create({
        owner: req.user!._id,
        storageKey: saved.storageKey,
        url: saved.url,
        originalFilename: saved.originalFilename,
        mimeType: saved.mimeType,
        fileSize: saved.fileSize,
        processingStatus: 'ready'
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded and validated successfully.',
        data: asset
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/media
router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assets = await MediaAsset.find({ owner: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/media/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const asset = await MediaAsset.findOne({
      _id: req.params.id,
      owner: req.user!._id
    });

    if (!asset) {
      res.status(404).json({ success: false, message: 'Media asset not found or unauthorized.' });
      return;
    }

    storageService.deleteFile(asset.storageKey);
    await asset.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Media asset deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
