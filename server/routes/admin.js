const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../models/user');
const Campaign = require('../models/campaign');
const Cause = require('../models/cause');
const adminMiddleware = require('../middleware/admin');

// Get all users with pagination and filters
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isVerified } = req.query;
    
    const query = {
      name: { $exists: true, $ne: null },
      password: { $exists: true, $ne: null },
      otp: { $exists: false }
    };
    
    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    
    const users = await User.find(query, '-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete a user
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Check if user has active campaigns
    const activeCampaigns = await Campaign.countDocuments({ 
      creator: req.params.id, 
      status: { $in: ['active', 'pending_review'] }
    });
    
    if (activeCampaigns > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete user with active campaigns' 
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all campaigns for admin review
router.get('/campaigns', adminMiddleware, async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const campaigns = await Campaign.find(query)
      .populate('creator', 'name email profilePicture')
      .populate('cause', 'name icon')
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

// Approve a campaign
router.patch('/campaigns/:id/approve', adminMiddleware, async (req, res) => {
  try {
    const { verificationNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid campaign ID format' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    campaign.status = 'active';
    campaign.isVerified = true;
    if (verificationNotes) campaign.verificationNotes = verificationNotes;

    await campaign.save();

    if (mongoose.Types.ObjectId.isValid(campaign.creator)) {
      await User.findByIdAndUpdate(campaign.creator, {
        $setOnInsert: { 'stats.totalRaised': 0 }
      }, { upsert: false });
    }

    res.json({ msg: 'Campaign approved ✅', campaign });
  } catch (err) {
    console.error('Error approving campaign:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// Reject a campaign
router.patch('/campaigns/:id/reject', adminMiddleware, async (req, res) => {
  try {
    const { verificationNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid campaign ID format' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    campaign.status = 'rejected';
    if (verificationNotes) campaign.verificationNotes = verificationNotes;

    await campaign.save();
    res.json({ msg: 'Campaign rejected', campaign });
  } catch (err) {
    console.error('Error rejecting campaign:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete any campaign (admin privilege)
router.delete('/delete-campaigns/:id', adminMiddleware, async (req, res) => {
  try {
     console.log('DELETE /delete-campaigns/:id hit'); 
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    // If campaign has donations, mark as cancelled instead of deleting
    if (campaign.raisedAmount > 0) {
      campaign.status = 'cancelled';
      await campaign.save();
      res.json({ msg: 'Campaign cancelled due to having received donations' });
    } else {
      await campaign.deleteOne();
      
      // Update cause campaign count
      await Cause.findByIdAndUpdate(campaign.cause, { 
        $inc: { campaignCount: -1 } 
      });
      
      res.json({ msg: 'Campaign deleted by admin' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

//get withdrawal requests
router.get('/withdrawals', adminMiddleware, async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 10 } = req.query;

    console.log("➡️ [ADMIN] Fetching withdrawals with status:", status);

    const campaigns = await Campaign.find({
      withdrawals: { $elemMatch: { status } }
    })
    .populate('creator', 'name email')
    .populate('cause', 'name')
    .sort({ 'withdrawals.requestedAt': -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    console.log("✅ [ADMIN] Campaigns fetched:", campaigns.length);

    const withdrawals = [];
    campaigns.forEach(campaign => {
      campaign.withdrawals
        .filter(w => w.status === status)
        .forEach(withdrawal => {
          withdrawals.push({
            ...withdrawal.toObject(),
            campaignId: campaign._id,
            campaignTitle: campaign.title,
            creator: campaign.creator,
            cause: campaign.cause
          });
        });
    });

    res.json({
      withdrawals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: withdrawals.length
      }
    });
  } catch (err) {
    console.error('❌ Error fetching withdrawals:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// Process withdrawal request
router.patch('/withdrawals/:campaignId/:withdrawalId', adminMiddleware, async (req, res) => {
  try {
    const { campaignId, withdrawalId } = req.params;
    const { status, transactionId, notes } = req.body;
    
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });
    
    const withdrawal = campaign.withdrawals.id(withdrawalId);
    if (!withdrawal) return res.status(404).json({ msg: 'Withdrawal request not found' });
    
    withdrawal.status = status;
    withdrawal.processedAt = new Date();
    if (transactionId) withdrawal.transactionId = transactionId;
    if (notes) withdrawal.notes = notes;
    
    // Update total withdrawn if approved
    if (status === 'completed') {
      campaign.totalWithdrawn += withdrawal.amount;
    }
    
    await campaign.save();
    res.json({ msg: `Withdrawal ${status}`, withdrawal });
  } catch (err) {
    console.error('Error processing withdrawal:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get dashboard stats
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const [
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      pendingCampaigns,
      totalRaised,
      totalCauses
    ] = await Promise.all([
      User.countDocuments({ 
        name: { $exists: true }, 
        password: { $exists: true } 
      }),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: 'active' }),
      Campaign.countDocuments({ status: 'pending_review' }),
      Campaign.aggregate([
        { $group: { _id: null, total: { $sum: '$raisedAmount' } } }
      ]),
      Cause.countDocuments({ isActive: true })
    ]);
    
    res.json({
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      pendingCampaigns,
      totalRaised: totalRaised[0]?.total || 0,
      totalCauses
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Verify user
router.patch('/users/:id/verify', adminMiddleware, async (req, res) => {
  try {
    const { isVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json({ 
      msg: `User ${isVerified ? 'verified' : 'unverified'} successfully`, 
      user 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;