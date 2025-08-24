/**
 * =============================================================================
 * SWAGGER CONFIGURATION - API DOCUMENTATION & TESTING
 * =============================================================================
 * Swagger setup for API documentation and testing interface
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// =============================================================================
// SWAGGER OPTIONS
// =============================================================================

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LumiLink API',
      version: '1.0.0',
      description: 'LumiLink Backend API Documentation - Quản lý liên kết cá nhân',
      contact: {
        name: 'LumiLink Team',
        email: 'support@lumilink.vn',
        url: 'https://lumilink.vn'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.lumilink.vn',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
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
            id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username (3-20 characters)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            displayName: {
              type: 'string',
              description: 'Display name'
            },
            bio: {
              type: 'string',
              description: 'User biography'
            },
            plan: {
              type: 'string',
              enum: ['free', 'premium'],
              description: 'User plan'
            },
            avatar: {
              type: 'string',
              nullable: true,
              description: 'Avatar URL'
            }
          }
        },
        Link: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Link ID'
            },
            title: {
              type: 'string',
              description: 'Link title'
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'Link URL'
            },
            platform: {
              type: 'string',
              description: 'Platform type (instagram, website, etc.)'
            },
            active: {
              type: 'boolean',
              description: 'Whether link is active'
            },
            clicks: {
              type: 'integer',
              description: 'Number of clicks'
            }
          }
        },
        Profile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Profile ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            displayName: {
              type: 'string',
              description: 'Display name'
            },
            bio: {
              type: 'string',
              description: 'Biography'
            },
            avatar: {
              type: 'string',
              nullable: true,
              description: 'Avatar URL'
            },
            links: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Link'
              }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'string',
              description: 'Error code'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Profiles',
        description: 'Public profile endpoints'
      },
      {
        name: 'Links',
        description: 'Link management endpoints'
      },
      {
        name: 'Analytics',
        description: 'Analytics and statistics endpoints'
      },
      {
        name: 'Upload',
        description: 'File upload endpoints'
      },
      {
        name: 'Premium',
        description: 'Premium subscription and payment endpoints'
      },
      {
        name: 'Admin',
        description: 'Administration endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.js', // Path to the API routes
    './src/controllers/*.js' // Path to the controllers
  ]
};

// =============================================================================
// SWAGGER SETUP
// =============================================================================

const specs = swaggerJsdoc(options);

// Custom CSS for Swagger UI
const customCss = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui .info .title { color: #8B5CF6; }
  .swagger-ui .scheme-container { background: #1F2937; }
`;

const swaggerOptions = {
  customCss,
  customSiteTitle: 'LumiLink API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
};

// =============================================================================
// SETUP FUNCTION
// =============================================================================

const setupSwagger = (app) => {
  
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
  
  // Serve raw OpenAPI spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  setupSwagger,
  specs
};

