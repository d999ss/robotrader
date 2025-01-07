const express = require('express');
const router = express.Router();
const Robot = require('../models/Robot');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all robots with filtering
router.get('/', async (req, res) => {
  console.log('GET /api/robots request received');
  console.log('MongoDB connection state:', mongoose.connection.readyState);
  
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Current state:', mongoose.connection.readyState);
      return res.status(503).json({
        message: 'Database connection not ready',
        state: mongoose.connection.readyState
      });
    }

    // Build query
    const query = {};
    console.log('Query parameters:', req.query);

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.manufacturer) {
      query.manufacturer = req.query.manufacturer;
    }
    if (req.query.condition) {
      query.condition = req.query.condition;
    }
    if (req.query.priceRange) {
      // Implement price range filtering
      const [min, max] = req.query.priceRange.split('-').map(Number);
      query.price = { $gte: min, $lte: max };
    }

    console.log('Final MongoDB query:', JSON.stringify(query, null, 2));

    // Set timeout for the query
    const timeout = 30000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timed out')), timeout)
    );

    // Execute query with timeout
    const queryPromise = Robot.find(query)
      .select('-__v')
      .lean()
      .exec();

    const robots = await Promise.race([queryPromise, timeoutPromise]);
    console.log(`Found ${robots.length} robots`);

    res.json(robots);
  } catch (err) {
    console.error('Error in GET /api/robots:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code
    });

    // Send appropriate error response
    if (err.message === 'Query timed out') {
      res.status(504).json({ message: 'Request timed out' });
    } else if (err.name === 'MongoError' || err.name === 'MongooseError') {
      res.status(503).json({ message: 'Database error', error: err.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
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
