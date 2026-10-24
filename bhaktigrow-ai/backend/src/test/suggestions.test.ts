import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { User } from '../models/User.js';
import { SavedSuggestion } from '../models/SavedSuggestion.js';

describe('Saved Suggestions API Endpoints', () => {
  const app = createApp();
  let token: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await SavedSuggestion.deleteMany({});

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Shiva Bhakt', email: 'shiva@test.com', password: 'Password123!' });
    token = res.body.token;
  });

  it('saves a suggestion and prevents duplicate entries', async () => {
    const payload = {
      suggestionId: 'yt-seo-hanuman-1',
      platform: 'youtube',
      category: 'Hanuman Chalisa',
      strategy: 'search-seo',
      title: 'Peaceful Hanuman Chalisa',
      description: 'Morning pooja recitation.'
    };

    // First save
    const res1 = await request(app)
      .post('/api/v1/suggestions')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res1.status).toBe(201);
    expect(res1.body.success).toBe(true);

    // Second save (duplicate attempt)
    const res2 = await request(app)
      .post('/api/v1/suggestions')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res2.status).toBe(200);
    expect(res2.body.message).toContain('already bookmarked');

    // Verify count in DB remains 1
    const listRes = await request(app)
      .get('/api/v1/suggestions')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.body.count).toBe(1);
  });

  it('deletes a saved suggestion', async () => {
    await request(app)
      .post('/api/v1/suggestions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        suggestionId: 'del-target-1',
        platform: 'instagram',
        category: 'Shiva Mantra',
        strategy: 'calm-meditative',
        title: 'Shiva Serenity',
        description: 'Breathe and listen.'
      });

    const delRes = await request(app)
      .delete('/api/v1/suggestions/del-target-1')
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const listRes = await request(app)
      .get('/api/v1/suggestions')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.body.count).toBe(0);
  });
});
