const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Campaign = require('../models/campaign');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Get current user's profile
router.get('/own-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, bio, phone, location, socialLinks, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (location) user.location = location;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password -otp -otpExpiry');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get public user profile
router.get('/get-public-profile:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name profilePicture bio location isVerified stats role createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if profile is public
    const fullUser = await User.findById(req.params.id).select('preferences.publicProfile');
    if (!fullUser.preferences.publicProfile) {
      return res.status(403).json({ message: 'This profile is private' });
    }
    
    // Get user's campaigns
    const campaigns = await Campaign.find({ creator: req.params.id })
      .select('title description goalAmount raisedAmount status createdAt')
      .sort({ createdAt: -1 });
    
    res.json({
      user,
      campaigns
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upload profile picture


router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/my-donations', protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ 'donations.donor': req.user.id })
      .populate('donations.donor', 'name profilePicture')
      .populate('cause', 'name');

    const userDonations = [];

    campaigns.forEach(campaign => {
      campaign.donations.forEach(donation => {
        if (donation.donor._id.toString() === req.user.id) {
          userDonations.push({
            campaignId: campaign._id,
            campaignTitle: campaign.title,
            cause: campaign.cause.name,
            amount: donation.amount,
            message: donation.message,
            isAnonymous: donation.isAnonymous,
            donatedAt: donation.donatedAt
          });
        }
      });
    });

    res.json(userDonations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-total-raised', protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator: req.user.id });
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    res.json({ totalRaised, campaigns });
  } catch (error) {
    console.error('Error fetching total raised:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-withdrawals', protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ 
      creator: req.user.id,
      $or: [
        { status: 'completed' },
        { withdrawals: { $exists: true, $not: { $size: 0 } } },
        { status: 'rejected' }
      ]
    }).select('title status withdrawals raisedAmount');

    const withdrawals = campaigns.flatMap(c => 
      c.withdrawals.map(w => ({
        campaignId: c._id,
        campaignTitle: c.title,
        status: w.status,
        amount: w.amount,
        bankDetails: w.bankDetails,
        requestedAt: w.requestedAt,
        processedAt: w.processedAt,
        transactionId: w.transactionId,
      }))
    );

    res.json(withdrawals);
  } catch (err) {
    console.error('Error fetching withdrawals:', err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;