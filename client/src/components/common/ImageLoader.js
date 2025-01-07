import React, { useState, useEffect } from 'react';
import {
  Box,
  Skeleton,
  CircularProgress,
  Typography,
  Fade,
  useTheme,
} from '@mui/material';
import { handleImageError } from '../../utils/imageUtils';
import { generateThumbnail } from '../../utils/imageCompression';

const ImageLoader = ({
  src,
  alt,
  category,
  width = '100%',
  height = 'auto',
  maxHeight,
  objectFit = 'cover',
  borderRadius = '8px',
  quality = 'high',
  priority = false,
  lazyLoad = true,
  showLoadingAnimation = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);

  // Calculate image dimensions for proper aspect ratio
  const aspectRatio = maxHeight ? `${width}/${maxHeight}` : 'auto';

  // Load thumbnail while main image loads
  useEffect(() => {
    if (showLoadingAnimation && src) {
      fetch(src)
        .then(response => response.blob())
        .then(blob => generateThumbnail(new File([blob], 'image.jpg')))
        .then(thumbnailUrl => setThumbnail(thumbnailUrl))
        .catch(console.error);
    }
  }, [src, showLoadingAnimation]);

  // Simulate loading progress
  useEffect(() => {
    if (loading && showLoadingAnimation) {
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [loading, showLoadingAnimation]);

  // Handle successful image load
  const handleLoad = () => {
    setLoadProgress(100);
    setTimeout(() => {
      setLoading(false);
      setError(false);
    }, 300); // Smooth transition
  };

  // Handle image error with custom error handler
  const handleErrorWithFallback = (e) => {
    setError(true);
    setLoading(false);
    handleImageError(e, category);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        maxHeight,
        borderRadius,
        overflow: 'hidden',
        aspectRatio,
        bgcolor: 'grey.100',
        ...sx,
      }}
    >
      {/* Loading State */}
      {loading && showLoadingAnimation && (
        <Fade in={loading} timeout={300}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              zIndex: 1,
            }}
          >
            {/* Thumbnail */}
            {thumbnail && (
              <Box
                component="img"
                src={thumbnail}
                alt={alt}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit,
                  filter: 'blur(10px)',
                  opacity: 0.7,
                }}
              />
            )}

            {/* Loading Animation */}
            <Box
              sx={{
                position: 'relative',
                width: 48,
                height: 48,
                mb: 1,
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                size={48}
                sx={{
                  position: 'absolute',
                  color: theme.palette.grey[200],
                }}
              />
              <CircularProgress
                variant="determinate"
                value={loadProgress}
                size={48}
                sx={{
                  position: 'absolute',
                  color: theme.palette.primary.main,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {Math.round(loadProgress)}%
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Error State */}
      {error && (
        <Fade in={error}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              color: 'text.secondary',
              zIndex: 1,
            }}
          >
            <Typography variant="caption">
              Error loading image
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Actual Image */}
      <Fade in={!loading} timeout={500}>
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleErrorWithFallback}
          loading={lazyLoad && !priority ? 'lazy' : 'eager'}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            borderRadius,
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            position: 'relative',
            zIndex: 2,
          }}
        />
      </Fade>
    </Box>
  );
};

export default ImageLoader;
