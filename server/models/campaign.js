const mongoose = require('mongoose');
const locationSchema = require('./location');


// const campaignSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   goalAmount: { type: Number, required: true },
//   currentAmount: { type: Number, default: 0 },
//   deadline: Date,
//   creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   createdAt: { type: Date, default: Date.now },
//   image: { type: String },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   }
// });

// // ✅ Compound index to prevent duplicates for same user+title
// campaignSchema.index({ creator: 1, title: 1 }, { unique: true });

// // ✅ Optional: Normalize title on save (ensures consistent casing)
// campaignSchema.pre('save', function (next) {
//   if (this.title) {
//     this.title = this.title.trim().toLowerCase();
//   }
//   next();
// });

// module.exports = mongoose.model('Campaign', campaignSchema);


// Enhanced Campaign Model
const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  cause: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cause',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  beneficiary: {
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      enum: ['self', 'family', 'friend', 'organization', 'community','relative'],
      required: true
    },
    age: Number,
    details: String
  },
  location: {
    type: locationSchema,
    required: true
  },
  goalAmount: {
    type: Number,
    required: true,
    min: 1000 // Minimum goal amount
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['medical_report', 'identity_proof', 'income_certificate', 'other']
    },
    url: String,
    name: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'active', 'paused', 'completed', 'cancelled', 'rejected'],
    default: 'draft'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationNotes: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [String],
  
  // Donation Portfolio
  donations: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      maxlength: 500
    },
    paymentId: String,
    donatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Financial Details
  withdrawals: [{
    amount: Number,
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String
    },
    transactionId: String,
    notes: String
  }],
  
  totalWithdrawn: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Campaign', campaignSchema);