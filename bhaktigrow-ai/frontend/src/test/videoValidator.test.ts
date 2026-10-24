import { describe, it, expect, vi } from 'vitest';
import { 
  validateVideoFile, 
  formatFileSize, 
  MAX_FILE_SIZE_BYTES, 
  LocalUrlManager 
} from '../lib/videoValidator';

describe('Video Upload Validator & Local URL Manager', () => {
  it('accepts standard MP4 video', () => {
    const file = new File(['dummy content'], 'chant.mp4', { type: 'video/mp4' });
    const result = validateVideoFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts WebM video', () => {
    const file = new File(['dummy content'], 'shiva_aarti.webm', { type: 'video/webm' });
    const result = validateVideoFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts MOV video with video/quicktime MIME', () => {
    const file = new File(['dummy content'], 'hanuman_chalisa.mov', { type: 'video/quicktime' });
    const result = validateVideoFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts MOV video with empty or generic MIME when extension is .mov', () => {
    const fileWithEmptyMime = new File(['dummy content'], 'krishna_bhajan.mov', { type: '' });
    const resultEmpty = validateVideoFile(fileWithEmptyMime);
    expect(resultEmpty.valid).toBe(true);

    const fileWithGenericMime = new File(['dummy content'], 'krishna_bhajan.mov', { type: 'application/octet-stream' });
    const resultGeneric = validateVideoFile(fileWithGenericMime);
    expect(resultGeneric.valid).toBe(true);
  });

  it('rejects files with unsupported extensions', () => {
    const file = new File(['dummy'], 'prayer.mp3', { type: 'audio/mp3' });
    const result = validateVideoFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported format');
  });

  it('rejects non-MOV files with empty MIME type', () => {
    const file = new File(['dummy'], 'test.xyz', { type: '' });
    const result = validateVideoFile(file);
    expect(result.valid).toBe(false);
  });

  it('rejects files exceeding 500 MB limit', () => {
    const oversizedFile = new File([''], 'huge_pooja.mp4', { type: 'video/mp4' });
    Object.defineProperty(oversizedFile, 'size', { value: MAX_FILE_SIZE_BYTES + 1024 });

    const result = validateVideoFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('500 MB limit');
  });

  it('formats file sizes accurately', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1024 * 1024 * 15)).toBe('15 MB');
  });

  it('manages Object URLs and revokes them to prevent memory leaks', () => {
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/dummy');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const manager = new LocalUrlManager();
    const file = new File(['data'], 'test.mp4', { type: 'video/mp4' });

    const url = manager.createUrl(file);
    expect(url).toBe('blob:http://localhost/dummy');
    expect(manager.getCurrentUrl()).toBe('blob:http://localhost/dummy');

    // Revoke
    manager.revoke();
    expect(revokeSpy).toHaveBeenCalledWith('blob:http://localhost/dummy');
    expect(manager.getCurrentUrl()).toBeNull();

    createSpy.mockRestore();
    revokeSpy.mockRestore();
  });
});
