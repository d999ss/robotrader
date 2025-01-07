import imageCompression from 'browser-image-compression';

// Compression options based on quality level
const compressionOptions = {
  high: {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.8,
  },
  medium: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    quality: 0.7,
  },
  low: {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    quality: 0.6,
  },
  thumbnail: {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 400,
    useWebWorker: true,
    quality: 0.5,
  },
};

// Compress an image file
export const compressImage = async (imageFile, quality = 'medium') => {
  try {
    const options = compressionOptions[quality] || compressionOptions.medium;
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return imageFile; // Return original file if compression fails
  }
};

// Convert compressed image to base64
export const getBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Generate image thumbnail
export const generateThumbnail = async (imageFile) => {
  try {
    const thumbnail = await compressImage(imageFile, 'thumbnail');
    return await getBase64(thumbnail);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};

// Optimize image for different screen sizes
export const optimizeForScreenSize = async (imageFile) => {
  const screenWidth = window.innerWidth;
  let quality;

  if (screenWidth <= 768) {
    quality = 'low';
  } else if (screenWidth <= 1280) {
    quality = 'medium';
  } else {
    quality = 'high';
  }

  return compressImage(imageFile, quality);
};

// Generate WebP version of image if supported
export const generateWebP = async (imageFile) => {
  try {
    const canvas = document.createElement('canvas');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/webp',
          0.8
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  } catch (error) {
    console.error('Error generating WebP:', error);
    return null;
  }
};
