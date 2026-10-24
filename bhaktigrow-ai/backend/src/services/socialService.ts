export interface SocialIntegrationStatus {
  platform: 'youtube' | 'instagram' | 'facebook';
  connected: boolean;
  accountName?: string;
  status: 'connected' | 'disconnected' | 'pending_approval' | 'error';
  authUrl?: string;
  message: string;
}

export class SocialService {
  getIntegrationStatus(platform: 'youtube' | 'instagram' | 'facebook'): SocialIntegrationStatus {
    const hasGoogleCreds = !!process.env.YOUTUBE_CLIENT_ID;
    const hasMetaCreds = !!process.env.INSTAGRAM_CLIENT_ID || !!process.env.FACEBOOK_APP_ID;

    if (platform === 'youtube') {
      return {
        platform: 'youtube',
        connected: false,
        status: hasGoogleCreds ? 'pending_approval' : 'disconnected',
        authUrl: hasGoogleCreds
          ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:5000/api/v1/social/callback/youtube')}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload`
          : undefined,
        message: hasGoogleCreds
          ? 'Google Cloud OAuth App configured. Awaiting user authorization.'
          : 'Official YouTube Data API credentials pending in environment variables.'
      };
    }

    if (platform === 'instagram') {
      return {
        platform: 'instagram',
        connected: false,
        status: hasMetaCreds ? 'pending_approval' : 'disconnected',
        authUrl: hasMetaCreds
          ? `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:5000/api/v1/social/callback/instagram')}&scope=instagram_basic,instagram_content_publish&response_type=code`
          : undefined,
        message: hasMetaCreds
          ? 'Meta for Developers App configured. Awaiting user authorization.'
          : 'Official Instagram Graph API credentials pending in environment variables.'
      };
    }

    // Facebook
    return {
      platform: 'facebook',
      connected: false,
      status: hasMetaCreds ? 'pending_approval' : 'disconnected',
      authUrl: hasMetaCreds
        ? `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent('http://localhost:5000/api/v1/social/callback/facebook')}&scope=pages_manage_posts,pages_read_engagement`
        : undefined,
      message: hasMetaCreds
        ? 'Facebook Graph API app configured. Awaiting Page token authorization.'
        : 'Official Facebook Graph API credentials pending in environment variables.'
    };
  }

  async publishScheduledPost(scheduleId: string, platform: 'youtube' | 'instagram' | 'facebook'): Promise<{ success: boolean; externalPostId?: string; error?: string }> {
    const status = this.getIntegrationStatus(platform);
    if (!status.connected) {
      return {
        success: false,
        error: `Cannot publish to ${platform}: Account is disconnected. Official API approval required.`
      };
    }

    return {
      success: true,
      externalPostId: `post-${Date.now()}`
    };
  }
}

export const socialService = new SocialService();
