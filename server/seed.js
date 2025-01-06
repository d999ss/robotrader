const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Robot = require('./models/Robot');
const User = require('./models/User');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('Connected to MongoDB');
    
    // Create a dummy user first
    const user = await User.findOneAndUpdate(
      { email: 'tesla@example.com' },
      {
        name: 'Tesla Sales',
        email: 'tesla@example.com',
        password: 'hashedpassword123',
        role: 'seller'
      },
      { upsert: true, new: true }
    );

    // Clear existing robots
    await Robot.deleteMany({});
    console.log('Cleared existing robots');

    const teslaBot = {
      title: "Tesla Optimus Gen 2",
      description: "The Future of Intelligent Robotics - Tesla's advanced humanoid robot designed for everyday assistance and automation.",
      price: 19999,
      manufacturer: "Tesla",
      model: "Optimus",
      year: 2025,
      condition: "New",
      features: [
        "AI-Powered Neural Network with Tesla's proprietary AI",
        "Multi-Task Capabilities for household and workplace tasks",
        "8-hour battery life with 2-hour charging",
        "Tesla Supercharger compatibility",
        "Tesla App Integration",
        "TeslaOS operating system"
      ],
      specifications: {
        height: "5'8\" (173 cm)",
        weight: "125 lbs (57 kg)",
        batteryLife: "8 hours",
        maxLiftCapacity: "45 lbs (20 kg)",
        processingUnit: "Tesla Dojo AI Chip",
        connectivity: "Wi-Fi 6E, 5G, Bluetooth 5.2",
        sensors: "8 high-definition cameras, LiDAR, ultrasonic sensors"
      },
      images: [
        "https://example.com/tesla-bot-main.jpg"
      ],
      seller: user._id,
      location: {
        city: "Fremont",
        state: "CA",
        country: "USA"
      },
      status: "available"
    };

    // Insert Tesla Bot
    await Robot.create(teslaBot);
    console.log('Inserted Tesla Bot');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

mongoose.connect('mongodb://localhost:27017/robotrader')
  .then(seedDatabase)
  .catch(error => {
    console.error('Connection error:', error);
    process.exit(1);
  });
