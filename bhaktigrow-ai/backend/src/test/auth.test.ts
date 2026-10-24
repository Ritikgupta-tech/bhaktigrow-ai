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

  it('handles forgot-password, resets password with valid token, and enforces single-use', async () => {
    const crypto = await import('crypto');
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Gopal Devotee',
        email: 'gopal@bhaktigrow.com',
        password: 'OriginalPassword123!'
      });

    // Request reset
    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'gopal@bhaktigrow.com' });

    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.success).toBe(true);
    // Verified: token is never exposed in response
    expect(forgotRes.body.devToken).toBeUndefined();
    expect(forgotRes.body.token).toBeUndefined();

    // Verify hashed token in DB
    const user = await User.findOne({ email: 'gopal@bhaktigrow.com' }).select('+resetPasswordToken +resetPasswordExpires');
    expect(user?.resetPasswordToken).toBeDefined();
    expect(user?.resetPasswordExpires).toBeDefined();

    // Manually test reset with a known valid token
    const testRawToken = 'test-secret-reset-token-1234567890';
    const testHashedToken = crypto.createHash('sha256').update(testRawToken).digest('hex');
    user!.resetPasswordToken = testHashedToken;
    user!.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user!.save();

    // Reset password successfully
    const resetRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: testRawToken,
        newPassword: 'BrandNewSecurePassword456!'
      });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // Verify token is invalidated (single-use)
    const userAfter = await User.findOne({ email: 'gopal@bhaktigrow.com' }).select('+resetPasswordToken');
    expect(userAfter?.resetPasswordToken).toBeUndefined();

    // Attempting to reuse the same token must fail
    const reuseRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: testRawToken,
        newPassword: 'AnotherPassword789!'
      });

    expect(reuseRes.status).toBe(400);
    expect(reuseRes.body.success).toBe(false);

    // Verify user can now log in with the new password
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'gopal@bhaktigrow.com',
        password: 'BrandNewSecurePassword456!'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
  });
});
