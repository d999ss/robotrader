const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Handle multiple image uploads
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
