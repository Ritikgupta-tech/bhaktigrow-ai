/**
 * Centralized API Client for BhaktiGrow AI
 * Connects frontend to the Express RESTful backend (/api/v1)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: unknown;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  errors?: Array<{ field?: string; message: string }>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('bhaktigrow_auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {})
    };

    // If body is not FormData, default to JSON
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'omit'
      });

      const data = await response.json().catch(() => ({
        success: response.ok,
        message: response.statusText
      }));

      if (!response.ok) {
        if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
          // Token expired or invalid
          localStorage.removeItem('bhaktigrow_auth_token');
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data as ApiResponse<T>;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error or backend unavailable';
      return {
        success: false,
        message
      };
    }
  }

  // Auth Endpoints
  auth = {
    register: (body: { name: string; email: string; password: string }) =>
      this.request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

    login: (body: { email: string; password: string }) =>
      this.request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

    logout: () => {
      localStorage.removeItem('bhaktigrow_auth_token');
      return this.request('/auth/logout', { method: 'POST' });
    },

    getMe: () => this.request('/auth/me', { method: 'GET' }),

    forgotPassword: (email: string) =>
      this.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

    resetPassword: (body: { token: string; newPassword: string }) =>
      this.request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

    changePassword: (body: { currentPassword: string; newPassword: string }) =>
      this.request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) })
  };

  // AI Generation Endpoints
  ai = {
    generate: (payload: {
      videoTitle: string;
      category: string;
      language?: string;
      tone?: string;
      videoFormat?: string;
      platforms: ('youtube' | 'instagram' | 'facebook')[];
      primaryKeywords?: string;
      secondaryKeywords?: string;
      targetAudience?: string;
      transcript?: string;
    }) => this.request('/ai/generate', { method: 'POST', body: JSON.stringify(payload) }),

    regenerate: (body: {
      suggestionId: string;
      currentSuggestions: unknown[];
      input: unknown;
    }) => this.request('/ai/regenerate', { method: 'POST', body: JSON.stringify(body) }),

    hashtags: (body: { category: string; topic: string; platform: string }) =>
      this.request('/ai/hashtags', { method: 'POST', body: JSON.stringify(body) }),

    repurpose: (body: { sourceContent: string; targetPlatform: string }) =>
      this.request('/ai/repurpose', { method: 'POST', body: JSON.stringify(body) })
  };

  // Content Drafts Endpoints
  content = {
    getAll: (params?: { platform?: string; status?: string; search?: string; page?: number; limit?: number }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return this.request(`/content${q ? `?${q}` : ''}`, { method: 'GET' });
    },
    create: (draft: unknown) =>
      this.request('/content', { method: 'POST', body: JSON.stringify(draft) }),
    getById: (id: string) => this.request(`/content/${id}`, { method: 'GET' }),
    update: (id: string, updates: unknown) =>
      this.request(`/content/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    delete: (id: string) => this.request(`/content/${id}`, { method: 'DELETE' })
  };

  // Saved Suggestions Endpoints
  suggestions = {
    getAll: (params?: { platform?: string; search?: string }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return this.request(`/suggestions${q ? `?${q}` : ''}`, { method: 'GET' });
    },
    save: (item: unknown) =>
      this.request('/suggestions', { method: 'POST', body: JSON.stringify(item) }),
    update: (id: string, updates: unknown) =>
      this.request(`/suggestions/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    delete: (id: string) => this.request(`/suggestions/${id}`, { method: 'DELETE' }),
    clearAll: () => this.request('/suggestions', { method: 'DELETE' })
  };

  // Calendar Schedule Endpoints
  calendar = {
    getAll: (params?: { platform?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return this.request(`/calendar${q ? `?${q}` : ''}`, { method: 'GET' });
    },
    create: (entry: unknown) =>
      this.request('/calendar', { method: 'POST', body: JSON.stringify(entry) }),
    update: (id: string, updates: unknown) =>
      this.request(`/calendar/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    delete: (id: string) => this.request(`/calendar/${id}`, { method: 'DELETE' })
  };

  // Media Endpoints
  media = {
    upload: (formData: FormData) =>
      this.request('/media/upload', { method: 'POST', body: formData }),
    getAll: () => this.request('/media', { method: 'GET' }),
    delete: (id: string) => this.request(`/media/${id}`, { method: 'DELETE' })
  };

  // Analytics Endpoints
  analytics = {
    getOverview: () => this.request('/analytics/overview', { method: 'GET' })
  };

  // Settings Endpoints
  settings = {
    get: () => this.request('/settings', { method: 'GET' }),
    update: (preferences: unknown) =>
      this.request('/settings', { method: 'PATCH', body: JSON.stringify(preferences) }),
    reset: () => this.request('/settings/reset', { method: 'POST' })
  };

  // Social Status
  social = {
    getStatus: () => this.request('/social/status', { method: 'GET' })
  };
}

export const api = new ApiClient(API_BASE_URL);
