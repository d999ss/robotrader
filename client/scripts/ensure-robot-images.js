const fs = require('fs');
const path = require('path');
const https = require('https');

// Base directory for robot images
const BASE_DIR = path.join(__dirname, '..', 'public', 'images', 'robots');

// Default robot images from a reliable source (using Robohash for consistent robot images)
const generateRobotImageUrl = (text, size = 300) => {
  return `https://robohash.org/${encodeURIComponent(text)}?set=set1&size=${size}x${size}`;
};

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Download image from URL
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

// Robot image configurations
const robotImages = {
  hero: [
    { name: 'trading-bot-hero-1', size: 1920 },
    { name: 'trading-bot-hero-2', size: 1920 },
    { name: 'trading-bot-hero-3', size: 1920 },
  ],
  featured: [
    { name: 'algo-trader-1', size: 1280 },
    { name: 'market-maker-1', size: 1280 },
    { name: 'high-freq-trader-1', size: 1280 },
  ],
  listing: [
    { name: 'quant-bot-1', size: 800 },
    { name: 'crypto-trader-1', size: 800 },
    { name: 'forex-bot-1', size: 800 },
    { name: 'options-trader-1', size: 800 },
    { name: 'futures-bot-1', size: 800 },
  ],
  detail: [
    { name: 'advanced-trader-1', size: 1440 },
    { name: 'smart-portfolio-1', size: 1440 },
    { name: 'ml-trader-1', size: 1440 },
  ],
  thumbnail: [
    { name: 'mini-trader-1', size: 400 },
    { name: 'mini-algo-1', size: 400 },
    { name: 'mini-quant-1', size: 400 },
  ],
  defaults: [
    { name: 'default-hero', size: 1920 },
    { name: 'default-featured', size: 1280 },
    { name: 'default-listing', size: 800 },
    { name: 'default-detail', size: 1440 },
    { name: 'default-thumbnail', size: 400 },
  ],
};

// Main function to ensure all robot images exist
async function ensureRobotImages() {
  // Create base directory
  ensureDirectoryExists(BASE_DIR);

  // Process each category
  for (const [category, images] of Object.entries(robotImages)) {
    const categoryDir = path.join(BASE_DIR, category);
    ensureDirectoryExists(categoryDir);

    // Download images for the category
    for (const image of images) {
      const filepath = path.join(categoryDir, `${image.name}.jpg`);
      
      // Only download if image doesn't exist
      if (!fs.existsSync(filepath)) {
        console.log(`Downloading ${image.name}...`);
        try {
          await downloadImage(
            generateRobotImageUrl(image.name, image.size),
            filepath
          );
          console.log(`Successfully downloaded ${image.name}`);
        } catch (error) {
          console.error(`Failed to download ${image.name}:`, error);
        }
      } else {
        console.log(`${image.name} already exists, skipping...`);
      }
    }
  }
}

// Run the script
console.log('Ensuring all robot images are present...');
ensureRobotImages()
  .then(() => console.log('Finished processing robot images'))
  .catch(console.error);
