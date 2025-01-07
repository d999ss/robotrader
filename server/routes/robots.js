const express = require('express');
const router = express.Router();
const Robot = require('../models/Robot');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all robots with filtering
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection state
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({ 
        message: 'Database connection not ready',
        state: mongoose.connection.readyState
      });
    }

    console.log('Received request to /api/robots');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    console.log('Received query:', req.query); // Debug log
    const filters = {};
    
    // Text search
    if (req.query.search) {
      filters.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { manufacturer: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { features: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Other filters
    if (req.query.manufacturer) filters.manufacturer = req.query.manufacturer;
    if (req.query.condition) filters.condition = req.query.condition;
    
    // Price range
    if (req.query.priceRange) {
      const [min, max] = req.query.priceRange.split('-').map(Number);
      filters.price = { $gte: min, $lte: max };
    }

    console.log('Applied filters:', filters); // Debug log
    
    // Set timeout and options for the query
    const queryOptions = {
      maxTimeMS: 20000, // 20 second timeout
      lean: true // Convert to plain JavaScript objects
    };
    
    console.log('Executing Robot.find()...');
    const robots = await Robot.find(filters)
      .setOptions(queryOptions)
      .sort({ createdAt: -1 })
      .populate('seller', 'name ratings')
      .exec();
    
    console.log(`Found ${robots.length} robots`); // Debug log
    res.json(robots);
  } catch (error) {
    console.error('Error in /api/robots:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Send appropriate error response
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      res.status(500).json({ 
        message: 'Database error occurred',
        error: error.message,
        code: error.code
      });
    } else {
      res.status(500).json({ 
        message: 'An unexpected error occurred',
        error: error.message
      });
    }
  }
});

// Get single robot
router.get('/:id', async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id)
      .populate('seller', 'name ratings phone email');
    if (!robot) {
      return res.status(404).json({ message: 'Robot not found' });
    }
    res.json(robot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new robot listing
router.post('/', auth, async (req, res) => {
  try {
    const robot = new Robot({
      ...req.body,
      seller: req.user._id
    });
    const savedRobot = await robot.save();
    res.status(201).json(savedRobot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update robot listing
router.patch('/:id', auth, async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id);
    if (!robot) {
      return res.status(404).json({ message: 'Robot not found' });
    }
    
    if (robot.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    Object.assign(robot, req.body);
    const updatedRobot = await robot.save();
    res.json(updatedRobot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete robot listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id);
    if (!robot) {
      return res.status(404).json({ message: 'Robot not found' });
    }
    
    if (robot.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await robot.deleteOne();
    res.json({ message: 'Robot listing deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search robots
router.get('/search/:query', async (req, res) => {
  try {
    const robots = await Robot.find(
      { $text: { $search: req.params.query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .populate('seller', 'name ratings');
    
    res.json(robots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
