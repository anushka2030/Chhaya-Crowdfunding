const express = require('express');
const router = express.Router();
const Cause = require('../models/cause');
const Campaign = require('../models/campaign');
const adminMiddleware = require('../middleware/admin');

// Get all causes with their campaigns
router.get('/get-causes', async (req, res) => {
  try {
    const causes = await Cause.find({ isActive: true })
      .populate({
        path: 'campaigns',
        match : {status: 'active'},
        populate: {
          path: 'creator',
          select: 'name profilePicture location isVerified'
        },
        options: { sort: { createdAt: -1 } }
      });
    
    res.json(causes);
  } catch (error) {
    console.error('Error fetching causes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get specific cause with campaigns
router.get('/:id/campaigns', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const skip = (page - 1) * limit;

    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }

    const campaigns = await Campaign.find({ 
      cause: req.params.id, 
      status 
    })
      .populate('creator', 'name profilePicture location isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Campaign.countDocuments({ 
      cause: req.params.id, 
      status 
    });

    res.json({
      cause,
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching cause campaigns:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new cause
router.post('/create-cause', adminMiddleware, async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    
    if (!name || !description || !icon) {
      return res.status(400).json({ 
        message: 'Name, description, and icon are required' 
      });
    }
    
    const cause = new Cause({
      name: name.trim(),
      description: description.trim(),
      icon,
      color: color || '#3B82F6'
    });
    
    await cause.save();
    res.status(201).json(cause);
  } catch (error) {
    console.error('Error creating cause:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete cause
router.delete('/delete-cause/:id', adminMiddleware, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }

    // Check if cause has campaigns
    if (cause.campaigns.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete cause with existing campaigns' 
      });
    }

    await cause.deleteOne();
    res.json({ message: 'Cause deleted successfully' });
  } catch (error) {
    console.error('Error deleting cause:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;