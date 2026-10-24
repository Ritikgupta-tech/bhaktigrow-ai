import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { User } from '../models/User.js';

describe('Authentication & User Management Endpoints', () => {
  const app = createApp();

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('registers a new user successfully and returns a JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Arjun Bhakt',
        email: 'arjun@bhaktigrow.com',
        password: 'Password123!'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('arjun@bhaktigrow.com');
    expect(res.body.user.passwordHash).toBeUndefined(); // Never leaks hash
  });

  it('rejects registration with an already existing email', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Devotee One',
        email: 'duplicate@bhaktigrow.com',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Devotee Two',
        email: 'duplicate@bhaktigrow.com',
        password: 'Password456!'
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('authenticates valid credentials on login', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Meera Devi',
        email: 'meera@bhaktigrow.com',
        password: 'SacredPassword99!'
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'meera@bhaktigrow.com',
        password: 'SacredPassword99!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects login with wrong password', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Kavita Das',
        email: 'kavita@bhaktigrow.com',
        password: 'CorrectPassword1!'
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'kavita@bhaktigrow.com',
        password: 'WrongPassword999!'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('fetches current user profile on GET /api/v1/auth/me when authenticated', async () => {
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Radhe Shyam',
        email: 'radhe@bhaktigrow.com',
        password: 'Password123!'
      });

    const token = reg.body.token;

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('Radhe Shyam');
  });

  it('blocks unauthenticated requests to protected endpoints', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
