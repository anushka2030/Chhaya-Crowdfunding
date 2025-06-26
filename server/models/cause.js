const mongoose = require('mongoose');
const Campaign = require('./campaign');

const causeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String, // URL or icon class name
    required: true
  },
  color: {
    type: String, // Hex color for UI theming
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Store references to campaigns
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }],
  
  campaignCount: {
    type: Number,
    default: 0
  },
  totalRaised: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cause', causeSchema);