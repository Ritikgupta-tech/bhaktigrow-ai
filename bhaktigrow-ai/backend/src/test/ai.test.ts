import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('AI Strategy Generation Endpoints', () => {
  const app = createApp();

  it('generates 5 suggestions for a single platform (YouTube)', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate')
      .send({
        videoTitle: 'Sacred Gayatri Mantra for Students & Focus',
        category: 'Gayatri Mantra',
        platforms: ['youtube']
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.data.every((s: any) => s.platform === 'youtube')).toBe(true);
  });

  it('generates exactly 15 suggestions when all 3 platforms are selected', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate')
      .send({
        videoTitle: 'Krishna Janmashtami Special Bhajans',
        category: 'Krishna Bhajan',
        platforms: ['youtube', 'instagram', 'facebook']
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(15);
  });

  it('generates devotional hashtags', async () => {
    const res = await request(app)
      .post('/api/v1/ai/hashtags')
      .send({
        category: 'Hanuman Chalisa',
        topic: 'Bajrangbali Aarti',
        platform: 'instagram'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(3);
    expect(res.body.data).toContain('#HanumanChalisa');
  });

  it('repurposes long-form reflection into a targeted platform suggestion', async () => {
    const res = await request(app)
      .post('/api/v1/ai/repurpose')
      .send({
        sourceContent: 'The bridge of devotion built by Lord Ram teaches us patience.',
        targetPlatform: 'instagram'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.platform).toBe('instagram');
    expect(res.body.data.reelCoverText).toBeDefined();
  });
});
