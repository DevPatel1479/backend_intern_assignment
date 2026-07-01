import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Intern Assignment API',
      version: '1.0.0',
      description: 'Authentication, role-based access, and CRUD API'
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required'
        },
        Forbidden: {
          description: 'Forbidden'
        },
        NotFound: {
          description: 'Resource not found'
        }
      }
    },
    paths: {
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'OK'
            }
          }
        }
      },
      '/api/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Created' },
            409: { description: 'Email already exists' }
          }
        }
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Success' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            200: { description: 'Current user' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/v1/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            200: { description: 'Logged out' }
          }
        }
      },
      '/api/v1/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'List tasks',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            200: {
              description: 'Task list'
            }
          }
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create task',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Created' }
          }
        }
      },
      '/api/v1/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by id',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Task found' },
            404: { description: 'Task not found' }
          }
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Update task',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Updated' },
            403: { description: 'Forbidden' }
          }
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete task',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Deleted' }
          }
        }
      },
      '/api/v1/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Admin list of users',
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            200: { description: 'Users list' },
            403: { description: 'Forbidden' }
          }
        }
      }
    }
  },
  apis: []
});
