import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { User } from '../models/User.js';
import { ContentSchedule } from '../models/ContentSchedule.js';

describe('Calendar Planning API Endpoints', () => {
  const app = createApp();
  let token: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await ContentSchedule.deleteMany({});

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Ganesh Devotee', email: 'ganesh@test.com', password: 'Password123!' });
    token = res.body.token;
  });

  it('automatically seeds sample calendar items for new users on first GET', async () => {
    const res = await request(app)
      .get('/api/v1/calendar')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.data[0].title).toBeDefined();
  });

  it('adds a new calendar entry and updates its scheduled date', async () => {
    const addRes = await request(app)
      .post('/api/v1/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Friday Durga Aarti Live Chants',
        platform: 'facebook',
        category: 'Durga Stuti',
        scheduledDateTime: new Date('2026-10-30T18:00:00Z').toISOString(),
        status: 'Scheduled Demo'
      });

    expect(addRes.status).toBe(201);
    const entryId = addRes.body.data._id;

    // Reschedule
    const patchRes = await request(app)
      .patch(`/api/v1/calendar/${entryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        scheduledDateTime: new Date('2026-10-31T09:00:00Z').toISOString(),
        status: 'Published Demo'
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('Published Demo');
  });
});
