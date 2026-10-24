import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

export interface UploadedFileResult {
  storageKey: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
}

export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = env.UPLOAD_DIR;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  saveLocalFile(file: Express.Multer.File): UploadedFileResult {
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const storageKey = `media-${uniqueSuffix}${ext}`;
    const destinationPath = path.join(this.uploadDir, storageKey);

    // If file is in memory (buffer), write it; if already on disk, rename
    if (file.buffer) {
      fs.writeFileSync(destinationPath, file.buffer);
    } else if (file.path && fs.existsSync(file.path)) {
      fs.renameSync(file.path, destinationPath);
    }

    const url = `/uploads/${storageKey}`;

    return {
      storageKey,
      url,
      originalFilename: file.originalname,
      mimeType: file.mimetype || 'video/mp4',
      fileSize: file.size
    };
  }

  deleteFile(storageKey: string): boolean {
    try {
      const filePath = path.join(this.uploadDir, storageKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.warn(`[StorageService] Failed to delete file ${storageKey}:`, err);
      return false;
    }
  }
}

export const storageService = new StorageService();
