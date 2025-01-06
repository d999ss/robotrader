import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Phone,
  Email,
  ArrowBack,
} from '@mui/icons-material';

const RobotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [robot, setRobot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchRobotDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/robots/${id}`);
      if (!response.ok) throw new Error('Robot not found');
      
      const data = await response.json();
      setRobot(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkFavoriteStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/users/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch favorites');
      
      const favorites = await response.json();
      setIsFavorite(favorites.some(fav => fav._id === id));
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchRobotDetails();
    checkFavoriteStatus();
  }, [fetchRobotDetails, checkFavoriteStatus]);

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/users/favorites/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to toggle favorite');
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !robot) {
    return (
      <Container>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error || 'Robot not found'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to listings
      </Button>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Images Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <img
                src={selectedImage || robot.images[0] || '/robot-placeholder.jpg'}
                alt={robot.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedImage(robot.images[0])}
              />
              <IconButton
                onClick={handleFavoriteToggle}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {isFavorite ? <Favorite color="primary" /> : <FavoriteBorder />}
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {robot.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${robot.title} ${index + 1}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedImage === image ? '2px solid #1976d2' : 'none',
                  }}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </Box>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {robot.title}
              </Typography>
              <Typography variant="h4" color="primary">
                ${robot.price.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Chip label={robot.condition} sx={{ mr: 1 }} />
              <Chip label={robot.manufacturer} />
            </Box>

            <Typography variant="body1" paragraph>
              {robot.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Height: {robot.specifications.height}cm
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Weight: {robot.specifications.weight}kg
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Battery Life: {robot.specifications.batteryLife}h
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Max Speed: {robot.specifications.maxSpeed}km/h
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box sx={{ mb: 3 }}>
              {robot.features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                />
              ))}
            </Box>

            <Typography variant="h6" gutterBottom>
              Seller Information
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                {robot.seller.name}
              </Typography>
              <Button
                startIcon={<Phone />}
                sx={{ mr: 2 }}
                href={`tel:${robot.seller.phone}`}
              >
                Call Seller
              </Button>
              <Button
                startIcon={<Email />}
                href={`mailto:${robot.seller.email}`}
              >
                Email Seller
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Listed on {new Date(robot.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        <DialogContent>
          <img
            src={selectedImage}
            alt={robot.title}
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RobotDetails;
