const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Glucometer Tracker API',
    description: 'API documentation for the Glucometer Tracker project',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/userRoutes.js', './routes/readingRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

