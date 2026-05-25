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
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://project-tcc-497310.uc.r.appspot.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
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

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err.stack);
  res.status(500).json({ error: "Something broke!", details: err.message });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API service running on port ${PORT}`);
});
