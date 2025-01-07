// Generate Robohash URL for consistent robot images
const getRobotImageUrl = (seed, size = 300) => {
  return `https://robohash.org/${encodeURIComponent(seed)}?set=set1&size=${size}x${size}`;
};

// Robot images for different categories using Robohash
export const ROBOT_IMAGES = {
  hero: [
    getRobotImageUrl('trading-hero-1', 1920),
    getRobotImageUrl('trading-hero-2', 1920),
    getRobotImageUrl('trading-hero-3', 1920),
  ],
  featured: [
    getRobotImageUrl('algo-trader-1', 800),
    getRobotImageUrl('market-maker-1', 800),
    getRobotImageUrl('high-freq-1', 800),
  ],
  listing: [
    getRobotImageUrl('quant-bot-1', 400),
    getRobotImageUrl('crypto-bot-1', 400),
    getRobotImageUrl('forex-bot-1', 400),
    getRobotImageUrl('options-bot-1', 400),
    getRobotImageUrl('futures-bot-1', 400),
  ],
  detail: [
    getRobotImageUrl('advanced-trader-1', 1200),
    getRobotImageUrl('smart-portfolio-1', 1200),
    getRobotImageUrl('ml-trader-1', 1200),
  ],
  thumbnail: [
    getRobotImageUrl('mini-trader-1', 200),
    getRobotImageUrl('mini-algo-1', 200),
    getRobotImageUrl('mini-quant-1', 200),
  ],
};

// Default fallback images
const DEFAULT_FALLBACKS = {
  hero: getRobotImageUrl('default-hero', 1920),
  featured: getRobotImageUrl('default-featured', 800),
  listing: getRobotImageUrl('default-listing', 400),
  detail: getRobotImageUrl('default-detail', 1200),
  thumbnail: getRobotImageUrl('default-thumbnail', 200),
};

// Configuration for different image categories
export const getCategoryConfig = (category) => {
  const configs = {
    hero: {
      aspectRatio: '21/9',
      maxWidth: 1920,
      quality: 'high',
      priority: true,
    },
    featured: {
      aspectRatio: '16/9',
      maxWidth: 800,
      quality: 'high',
      priority: true,
    },
    listing: {
      aspectRatio: '4/3',
      maxWidth: 400,
      quality: 'medium',
      priority: false,
    },
    detail: {
      aspectRatio: '16/9',
      maxWidth: 1200,
      quality: 'high',
      priority: true,
    },
    thumbnail: {
      aspectRatio: '1/1',
      maxWidth: 200,
      quality: 'low',
      priority: false,
    },
  };

  return configs[category] || configs.listing;
};

// Get a random image for a specific category
export const getRandomImage = (category) => {
  const images = ROBOT_IMAGES[category];
  if (!images || images.length === 0) {
    return DEFAULT_FALLBACKS[category];
  }
  return images[Math.floor(Math.random() * images.length)];
};

// Handle image loading errors
export const handleImageError = (event, category) => {
  const fallbackImage = DEFAULT_FALLBACKS[category];
  if (event.target.src !== fallbackImage) {
    event.target.src = fallbackImage;
  }
};

// Get srcSet for responsive images
export const getResponsiveSrcSet = (imagePath, category) => {
  // For Robohash URLs, we don't need srcSet
  return imagePath;
};

// Calculate image dimensions based on aspect ratio
export const calculateDimensions = (category, containerWidth) => {
  const config = getCategoryConfig(category);
  const [width, height] = config.aspectRatio.split('/');
  const aspectRatio = width / height;
  
  return {
    width: containerWidth,
    height: Math.round(containerWidth / aspectRatio),
  };
};
