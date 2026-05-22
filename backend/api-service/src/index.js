require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./config/mongodb');

const staffRoutes = require('./routes/staffRoutes');
const packageRoutes = require('./routes/packageRoutes');
const orderRoutes = require('./routes/orderRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const photoRoutes = require('./routes/photoRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

connectMongoDB();

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'api-service' });
});

app.use('/api/staff', staffRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`API service running on port ${PORT}`);
});
