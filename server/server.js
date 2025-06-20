const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware for static files
app.use('/uploads', (req, res, next) => {
  console.log('📁 Static file requested:', req.path);
  console.log('📁 Full URL:', req.originalUrl);
  console.log('📁 File path would be:', path.join(__dirname, 'uploads', req.path));
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaign', require('./routes/campaign'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/causes', require('./routes/causes'));


// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('🟢 Static /uploads route enabled');
console.log('🟢 Uploads directory path:', path.join(__dirname, 'uploads'));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => console.error('❌ Mongo error:', err));