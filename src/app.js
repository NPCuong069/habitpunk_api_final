const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const userRoutes = require('./api/userApi');
const habitRoutes = require('./api/habitApi');
const dailyRoutes = require('./api/dailyApi');
const itemRoutes = require('./api/itemApi');
const notificationRoutes = require('./api/notificationApi');
const partyRoutes = require('./api/partyApi');
const questRoutes = require('./api/questApi')
const invitationRoutes = require('./api/invitationApi');
const partyQuestRoutes = require('./api/partyQuestApi');
const subscriptionRoutes = require('./api/subscriptionApi');
const chatRoutes = require('./api/chatApi');
const cors = require('cors');

const app = express();

const swaggerDocument = YAML.load('./src/swagger.yaml');
const notificationCron = require('./cron/notificationCron');

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api',userRoutes);
app.use('/api',habitRoutes);
app.use('/api',dailyRoutes);
app.use('/api',itemRoutes);
app.use('/api', notificationRoutes);
app.use('/api', partyRoutes);
app.use('/api', questRoutes);
app.use('/api', invitationRoutes);
app.use('/api', partyQuestRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api',chatRoutes);
notificationCron.startCronJob();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available on http://localhost:${PORT}/api-docs`);
});
