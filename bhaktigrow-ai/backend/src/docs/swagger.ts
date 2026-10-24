export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'BhaktiGrow AI API',
    version: '1.0.0',
    description: 'RESTful API for BhaktiGrow AI — Devotional Content Growth & Optimization Platform'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        responses: {
          200: { description: 'Server is healthy' }
        }
      }
    },
    '/ready': {
      get: {
        summary: 'Readiness check for database',
        responses: {
          200: { description: 'Database connected and ready' },
          503: { description: 'Database disconnected' }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Register a new creator account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User created' },
          409: { description: 'Email already exists' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate and receive JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user data' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/ai/generate': {
      post: {
        summary: 'Generate 5 devotional strategies per platform',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['videoTitle', 'category', 'platforms'],
                properties: {
                  videoTitle: { type: 'string' },
                  category: { type: 'string' },
                  platforms: { type: 'array', items: { type: 'string', enum: ['youtube', 'instagram', 'facebook'] } },
                  tone: { type: 'string' },
                  language: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Generated suggestions' }
        }
      }
    },
    '/content': {
      get: {
        summary: 'List user content drafts',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User drafts' }
        }
      },
      post: {
        summary: 'Create a content draft',
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Draft created' }
        }
      }
    },
    '/suggestions': {
      get: {
        summary: 'List user saved suggestions',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Saved suggestions' }
        }
      },
      post: {
        summary: 'Save a suggestion',
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Suggestion saved' }
        }
      }
    },
    '/calendar': {
      get: {
        summary: 'List scheduled releases',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Calendar schedule entries' }
        }
      },
      post: {
        summary: 'Add a calendar entry',
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Entry scheduled' }
        }
      }
    },
    '/analytics/overview': {
      get: {
        summary: 'Get user analytics overview',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Aggregated analytics metrics' }
        }
      }
    }
  }
};
