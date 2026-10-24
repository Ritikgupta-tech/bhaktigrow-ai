export interface VideoValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: string;
  formattedSize?: string;
}

export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov'];

const ALLOWED_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska'
];

/**
 * Format bytes to readable string (e.g. 45.2 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate video file by size, extension, and MIME type
 * Handles browser edge cases where .mov or generic videos have empty/generic MIME types
 */
export function validateVideoFile(file: File): VideoValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  // 1. File Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 500 MB limit (${formatFileSize(file.size)}). Please choose a smaller video file.`,
      formattedSize: formatFileSize(file.size)
    };
  }

  // 2. Extension check
  const fileName = file.name.toLowerCase();
  const matchedExt = ALLOWED_EXTENSIONS.find(ext => fileName.endsWith(ext));

  if (!matchedExt) {
    return {
      valid: false,
      error: `Unsupported format. Allowed formats are MP4, WebM, and MOV (${file.name}).`,
      formattedSize: formatFileSize(file.size)
    };
  }

  // 3. MIME check (Permit empty/generic MIME only if extension is .mov, since macOS/Windows browsers frequently report '' or 'application/octet-stream' for QuickTime MOV)
  const mimeType = file.type.toLowerCase();
  const isGenericOrEmpty = !mimeType || mimeType === 'application/octet-stream';

  if (isGenericOrEmpty) {
    if (matchedExt === '.mov') {
      return {
        valid: true,
        detectedType: 'QuickTime MOV (Local Browser Codec dependent)',
        formattedSize: formatFileSize(file.size)
      };
    } else {
      return {
        valid: false,
        error: `Could not verify video MIME type for ${file.name}.`,
        formattedSize: formatFileSize(file.size)
      };
    }
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType) && !mimeType.startsWith('video/')) {
    return {
      valid: false,
      error: `Invalid file MIME type: ${file.type}. Please select a valid video file.`,
      formattedSize: formatFileSize(file.size)
    };
  }

  return {
    valid: true,
    detectedType: mimeType || matchedExt.replace('.', '').toUpperCase(),
    formattedSize: formatFileSize(file.size)
  };
}

/**
 * Object URL lifecycle helper to prevent browser memory leaks
 */
export class LocalUrlManager {
  private activeUrl: string | null = null;

  createUrl(file: File): string {
    this.revoke();
    this.activeUrl = URL.createObjectURL(file);
    return this.activeUrl;
  }

  revoke(): void {
    if (this.activeUrl) {
      URL.revokeObjectURL(this.activeUrl);
      this.activeUrl = null;
    }
  }

  getCurrentUrl(): string | null {
    return this.activeUrl;
  }
}
