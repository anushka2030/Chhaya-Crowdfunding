// Enhanced User Model
const mongoose = require('mongoose');
const locationSchema = require('./location');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  otp: { type: String },
otpExpiry: { type: Date },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
  type: String,
  minlength: 6,
  required: function () {
    return !this.otp; // Require password only if OTP is not used
  }
},

  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String, // URL to image
    default: null
  },
  location: locationSchema,
  bio: {
    type: String,
    maxlength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['government_id', 'address_proof', 'bank_statement']
    },
    url: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    publicProfile: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalDonated: {
      type: Number,
      default: 0
    },
    totalRaised: {
      type: Number,
      default: 0
    },
    campaignsCreated: {
      type: Number,
      default: 0
    },
    campaignsSupported: {
      type: Number,
      default: 0
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
}, {
  timestamps: true
});
module.exports = mongoose.models.User || mongoose.model('User', userSchema);