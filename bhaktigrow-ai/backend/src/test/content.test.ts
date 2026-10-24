import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { User } from '../models/User.js';
import { ContentDraft } from '../models/ContentDraft.js';

describe('Content Drafts API & Resource Ownership Isolation', () => {
  const app = createApp();
  let tokenUserA: string;
  let tokenUserB: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await ContentDraft.deleteMany({});

    // Register User A
    const resA = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User A', email: 'userA@test.com', password: 'Password123!' });
    tokenUserA = resA.body.token;

    // Register User B
    const resB = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'User B', email: 'userB@test.com', password: 'Password123!' });
    tokenUserB = resB.body.token;
  });

  it('creates a content draft for User A', async () => {
    const res = await request(app)
      .post('/api/v1/content')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({
        platform: 'youtube',
        topic: 'Hanuman Chalisa 11 Times',
        category: 'Hanuman Chalisa',
        generatedTitle: 'Most Peaceful Hanuman Chalisa Recitation',
        caption: 'Full recitation with lyrics and meaning.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.topic).toBe('Hanuman Chalisa 11 Times');
  });

  it('strictly isolates records: User B cannot access or modify User A drafts', async () => {
    // 1. User A creates draft
    const createRes = await request(app)
      .post('/api/v1/content')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({
        platform: 'instagram',
        topic: 'Shiva Dhun 432Hz',
        category: 'Shiva Mantra',
        generatedTitle: '30 Seconds of Shiva Peace',
        caption: 'Pause and breathe.'
      });

    const draftId = createRes.body.data._id;

    // 2. User B attempts to read User A's draft
    const readRes = await request(app)
      .get(`/api/v1/content/${draftId}`)
      .set('Authorization', `Bearer ${tokenUserB}`);

    expect(readRes.status).toBe(404); // Returns 404 to avoid leaking existence

    // 3. User B attempts to update User A's draft
    const updateRes = await request(app)
      .patch(`/api/v1/content/${draftId}`)
      .set('Authorization', `Bearer ${tokenUserB}`)
      .send({ generatedTitle: 'Malicious Overwrite' });

    expect(updateRes.status).toBe(404);

    // 4. User B attempts to delete User A's draft
    const deleteRes = await request(app)
      .delete(`/api/v1/content/${draftId}`)
      .set('Authorization', `Bearer ${tokenUserB}`);

    expect(deleteRes.status).toBe(404);

    // 5. Verify User A draft remains untouched
    const verifyRes = await request(app)
      .get(`/api/v1/content/${draftId}`)
      .set('Authorization', `Bearer ${tokenUserA}`);

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.generatedTitle).toBe('30 Seconds of Shiva Peace');
  });
});
