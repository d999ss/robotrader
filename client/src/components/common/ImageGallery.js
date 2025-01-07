import React, { useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  useTheme,
  Typography,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from '@mui/icons-material';
import ImageLoader from './ImageLoader';

const ImageGallery = ({
  images,
  category = 'detail',
  initialIndex = 0,
  thumbnailSize = 80,
  spacing = 2,
  aspectRatio = '16/9',
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Handle image navigation
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') handleNext();
    if (event.key === 'ArrowLeft') handlePrev();
    if (event.key === 'Escape') setZoomOpen(false);
  }, [handleNext, handlePrev]);

  // Handle zoom functionality
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  // Handle drag functionality for zoomed image
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragPosition({
        x: e.clientX - dragPosition.x,
        y: e.clientY - dragPosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragPosition.x;
      const newY = e.clientY - dragPosition.y;
      
      // Calculate boundaries
      const maxX = (zoomLevel - 1) * window.innerWidth / 2;
      const maxY = (zoomLevel - 1) * window.innerHeight / 2;
      
      setDragPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Render thumbnails
  const renderThumbnails = () => (
    <Box
      sx={{
        display: 'flex',
        gap: spacing,
        mt: spacing,
        overflowX: 'auto',
        pb: 1,
      }}
    >
      {images.map((image, index) => (
        <Paper
          key={index}
          elevation={index === currentIndex ? 8 : 1}
          sx={{
            width: thumbnailSize,
            height: thumbnailSize,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          onClick={() => setCurrentIndex(index)}
        >
          <ImageLoader
            src={image}
            alt={`Thumbnail ${index + 1}`}
            category="thumbnail"
            width={thumbnailSize}
            height={thumbnailSize}
            objectFit="cover"
          />
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box>
      {/* Main Image Display */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: `calc(100% / (${aspectRatio.split('/')[0]} / ${aspectRatio.split('/')[1]}))`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <ImageLoader
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            category={category}
            width="100%"
            height="100%"
            objectFit="contain"
            quality="high"
            priority={true}
          />
          
          {/* Navigation Buttons */}
          <IconButton
            sx={{
              position: 'absolute',
              left: theme.spacing(1),
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
            onClick={handlePrev}
          >
            <PrevIcon />
          </IconButton>
          <IconButton
            sx={{
              position: 'absolute',
              right: theme.spacing(1),
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
            onClick={handleNext}
          >
            <NextIcon />
          </IconButton>

          {/* Zoom Button */}
          <IconButton
            sx={{
              position: 'absolute',
              right: theme.spacing(1),
              bottom: theme.spacing(1),
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
            onClick={() => setZoomOpen(true)}
          >
            <ZoomInIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && renderThumbnails()}

      {/* Zoom Dialog */}
      <Dialog
        open={zoomOpen}
        onClose={() => {
          setZoomOpen(false);
          setZoomLevel(1);
          setDragPosition({ x: 0, y: 0 });
        }}
        maxWidth="xl"
        fullWidth
        onKeyDown={handleKeyDown}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            height: '90vh',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <IconButton
            sx={{
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(1),
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
            onClick={() => setZoomOpen(false)}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={images[currentIndex]}
              alt={`Zoomed Image ${currentIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${zoomLevel}) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
              }}
            />
          </Box>

          {/* Zoom Controls */}
          <Box
            sx={{
              position: 'absolute',
              bottom: theme.spacing(2),
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 1,
              px: 2,
              py: 1,
            }}
          >
            <IconButton onClick={handleZoomOut} disabled={zoomLevel <= 1}>
              <Typography>-</Typography>
            </IconButton>
            <Typography>{Math.round(zoomLevel * 100)}%</Typography>
            <IconButton onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              <Typography>+</Typography>
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
