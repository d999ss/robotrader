const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'phone'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's listings
router.get('/listings', auth, async (req, res) => {
  try {
    await req.user.populate('listings');
    res.json(req.user.listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's favorite listings
router.get('/favorites', auth, async (req, res) => {
  try {
    await req.user.populate('favorites');
    res.json(req.user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add/Remove favorite
router.post('/favorites/:robotId', auth, async (req, res) => {
  try {
    const robotId = req.params.robotId;
    const user = req.user;
    
    const index = user.favorites.indexOf(robotId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(robotId);
    }
    
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
