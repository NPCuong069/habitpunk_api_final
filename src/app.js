const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const userRoutes = require('./api/userApi');
const habitRoutes = require('./api/habitApi');
const dailyRoutes = require('./api/dailyApi');
const itemRoutes = require('./api/itemApi');
const cors = require('cors');

const app = express();

// Load Swagger document as a JS object
const swaggerDocument = YAML.load('./src/swagger.yaml'); // Make sure the path is correct
app.use(cors());
app.use(express.json());

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use user routes
app.use('/api',userRoutes);
app.use('/api',habitRoutes);
app.use('/api',dailyRoutes);
app.use('/api',itemRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available on http://localhost:${PORT}/api-docs`);
});
