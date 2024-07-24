const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Employee API',
    version: '1.0.0',
    description: 'Employee API documentations',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./docs/*.yaml'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;