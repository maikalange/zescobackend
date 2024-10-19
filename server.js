// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Location Schema and Model
const LocationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  isHot: Boolean,
  date: Number
});

const Location = mongoose.model('Location', LocationSchema);

// Routes

// Get all locations
app.get('/locations', async (req, res) => {
  const currentDate  = Date.now();
  const last24Hours = currentDate - 86400000;
  const locations = (await Location.find({date:{$gte:last24Hours,$lte:currentDate}}).sort({_id:-1}).limit(255));
  res.json(locations);
});

// Post a new location
app.post('/locations', async (req, res) => {
  const { lat, lng, isHot,date } = req.body;
  const newLocation = new Location({ lat, lng, isHot,date });
  await newLocation.save();
  res.json(newLocation);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
