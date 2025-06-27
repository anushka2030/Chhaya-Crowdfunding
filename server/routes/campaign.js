const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');
const Cause = require('../models/cause');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');
const mongoose = require('mongoose');

// JWT Middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.header('x-auth-token');
//   if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ msg: 'Token is not valid' });
//   }
// };
const authMiddleware = require('../middleware/authMiddleware');

// Create campaign with multiple image uploads
router.post('/create', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    console.log('=== DEBUG INFO ===');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    console.log('=== END DEBUG ===');
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        msg: 'Request body is empty. Check middleware order.' 
      });
    }
    
    const { 
      title, 
      description, 
      cause, 
      goalAmount, 
      endDate,
      beneficiaryName,
      beneficiaryRelationship,
      beneficiaryAge,
      beneficiaryDetails,
      country,
      state,
      city,
      pincode,
      isUrgent,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !cause || !goalAmount || !endDate || 
        !beneficiaryName || !beneficiaryRelationship || !country || !state || !city) {
      return res.status(400).json({ msg: 'All required fields must be provided' });
    }

    // Verify cause exists
    const causeExists = await Cause.findById(cause);
    if (!causeExists) {
      return res.status(400).json({ msg: 'Invalid cause selected' });
    }

    // Process uploaded images
    const images = [];
const baseUrl = process.env.REACT_APP_UPLOAD_URL || 'https://chhaya-81p3.onrender.com/uploads';

if (req.files && req.files.length > 0) {
  req.files.forEach((file, index) => {
    images.push({
      url: `${baseUrl}/${file.filename.replace(/\\/g, '/')}`, // Full URL
      caption: req.body[`imageCaption_${index}`] || '',
      isPrimary: index === 0 // First image is primary
    });
  });
}


    // Create campaign object
    const campaignData = {
      title: title.trim(),
      description,
      cause,
      creator: req.user.id,
      beneficiary: {
        name: beneficiaryName,
        relationship: beneficiaryRelationship,
        age: beneficiaryAge ? parseInt(beneficiaryAge) : undefined,
        details: beneficiaryDetails
      },
      location: {
        country,
        state,
        city,
        pincode
      },
      goalAmount: parseFloat(goalAmount),
      endDate: new Date(endDate),
      images,
      isUrgent: isUrgent === 'true',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'pending_review'
    };

    const newCampaign = new Campaign(campaignData);
    const savedCampaign = await newCampaign.save();

    // Add campaign to cause and update stats
    await Cause.findByIdAndUpdate(cause, { 
      $push: { campaigns: savedCampaign._id },
      $inc: { campaignCount: 1 }
    });
    
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, { 
      $inc: { 'stats.campaignsCreated': 1 } 
    });

    res.status(201).json(savedCampaign);

  } catch (err) {
    console.error('Detailed error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update campaign with optional image uploads
router.put('/update/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized - You can only update your own campaigns' });
    }

    // Only allow updates if campaign is in draft or pending_review status
    if (!['draft', 'pending_review'].includes(campaign.status)) {
      return res.status(400).json({ msg: 'Campaign cannot be edited in current status' });
    }

    const updates = {};
    const allowedUpdates = [
      'title', 'description', 'goalAmount', 'endDate', 'isUrgent', 'tags'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'goalAmount') {
          updates[field] = parseFloat(req.body[field]);
        } else if (field === 'endDate') {
          updates[field] = new Date(req.body[field]);
        } else if (field === 'isUrgent') {
          updates[field] = req.body[field] === 'true';
        } else if (field === 'tags') {
          updates[field] = req.body[field].split(',').map(tag => tag.trim());
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // ✅ FIXED IMAGE UPLOAD BLOCK
    const baseUrl = process.env.REACT_APP_UPLOAD_URL || 'https://chhaya-81p3.onrender.com/uploads';
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `${baseUrl}/${file.filename.replace(/\\/g, '/')}`,
        caption: req.body[`imageCaption_${index}`] || '',
        isPrimary: campaign.images.length === 0 && index === 0
      }));

      // Merge with existing images (or replace, your choice)
      updates.images = [...campaign.images, ...newImages];
    }

    Object.assign(campaign, updates);
    await campaign.save();

    res.json(campaign);
  } catch (err) {
    console.error('Error updating campaign:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// Donate to a campaign
// Donate to a campaign
router.post('/:id/donate', authMiddleware, async (req, res) => {
  try {
    const { amount, message, isAnonymous = false, paymentId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Valid donation amount is required' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    // Check if campaign has expired
    const now = new Date();
    if (new Date(campaign.endDate) < now) {
      return res.status(400).json({ msg: 'Campaign has ended. Donations are closed.' });
    }

    // Check if campaign is accepting donations
    if (campaign.status !== 'active') {
      return res.status(400).json({ msg: 'Campaign is not accepting donations' });
    }

    // Check if goal already reached
    if (campaign.raisedAmount >= campaign.goalAmount) {
      return res.status(400).json({ msg: 'Campaign has already reached its goal.' });
    }

    // Prevent overfunding
    const availableAmount = campaign.goalAmount - campaign.raisedAmount;
    if (amount > availableAmount) {
      return res.status(400).json({ msg: `Only ₹${availableAmount.toFixed(2)} left to reach the goal.` });
    }

    // Add donation to campaign
    const donation = {
      donor: req.user.id,
      amount: parseFloat(amount),
      message,
      isAnonymous,
      paymentId
    };

    campaign.donations.push(donation);
    campaign.raisedAmount += parseFloat(amount);

    // Auto-complete if fully funded
    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = 'completed';
    }

    await campaign.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        'stats.totalDonated': parseFloat(amount),
        'stats.campaignsSupported': 1
      }
    });

    // Update cause stats
    await Cause.findByIdAndUpdate(campaign.cause, {
      $inc: { totalRaised: parseFloat(amount) }
    });

    // Send response
    res.json({
      msg: 'Donation successful',
      campaign: await Campaign.findById(req.params.id)
        .populate('creator', 'name')
        .populate('cause', 'name')
    });

  } catch (err) {
    console.error('Error processing donation:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// Request withdrawal
router.post('/:id/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, accountNumber, ifscCode, accountHolderName } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const availableAmount = campaign.raisedAmount - campaign.totalWithdrawn;
    if (amount > availableAmount) {
      return res.status(400).json({ msg: 'Insufficient funds available for withdrawal' });
    }

    const withdrawal = {
      amount: parseFloat(amount),
      bankDetails: {
        accountNumber,
        ifscCode,
        accountHolderName
      }
    };

    campaign.withdrawals.push(withdrawal);
    await campaign.save();

    res.json({ msg: 'Withdrawal request submitted for review' });
  } catch (err) {
    console.error('Error processing withdrawal:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete own campaign
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized - You can only delete your own campaigns' });
    }

    // Only allow deletion if no donations received
    if (campaign.raisedAmount > 0) {
      return res.status(400).json({ msg: 'Cannot delete campaign that has received donations' });
    }

    // Remove campaign from cause and update stats
    await Cause.findByIdAndUpdate(campaign.cause, { 
      $pull: { campaigns: campaign._id },
      $inc: { campaignCount: -1 }
    });

    await campaign.deleteOne();
    
    res.json({ msg: 'Campaign deleted successfully' });
  } catch (err) {
    console.error('Error deleting campaign:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all campaigns with filters
router.get('/all', async (req, res) => {
  try {
    const { 
      status = 'active', 
      cause, 
      location, 
      title,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status }; // ✅ Move this up first

    if (title) query.title = new RegExp('^' + title, 'i'); // ✅ Now it's safe

    if (cause) query.cause = cause;
    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }

    console.log('Incoming search title:', req.query.title);

    const campaigns = await Campaign.find(query)
      .populate('creator', 'name profilePicture')
      .populate('cause', 'name icon color')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Campaign.countDocuments(query);

    res.json({
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// Get user's campaigns
router.get('/user/my-campaigns', authMiddleware, async (req, res) => {

  try {
    console.log('👉 my-campaigns hit by:', req.user.id);

    const campaigns = await Campaign.find({ creator: req.user.id })
      .populate('cause', 'name icon')
      .sort({ createdAt: -1 });
     
console.log('📦 Found campaigns:', campaigns.length);
    res.json(campaigns);
  } catch (err) {
    console.error('Error fetching user campaigns:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('creator', 'name profilePicture location isVerified')
      .populate('cause', 'name icon color')
      .populate('donations.donor', 'name profilePicture');
    
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });
    
    res.json(campaign);
  } catch (err) {
    console.error('Error fetching campaign:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});




module.exports = router;