const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
    required: true
  },
  features: [{
    type: String
  }],
  specifications: {
    height: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      required: true
    },
    batteryLife: {
      type: String,
      required: true
    },
    maxLiftCapacity: {
      type: String,
      required: true
    },
    processingUnit: {
      type: String,
      required: true
    },
    connectivity: {
      type: String,
      required: true
    },
    sensors: {
      type: String,
      required: true
    }
  },
  images: [{
    type: String,
    required: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for text search
robotSchema.index({
  title: 'text',
  description: 'text',
  manufacturer: 'text',
  model: 'text'
});

robotSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Robot', robotSchema);
