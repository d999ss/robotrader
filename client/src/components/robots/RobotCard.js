import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const RobotCard = ({ robot, onFavoriteToggle, isFavorite }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCardClick = (e) => {
    // Don't navigate if clicking the favorite button
    if (e.target.closest('button')) return;
    navigate(`/robots/${robot._id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (JSON.parse(localStorage.getItem('user'))) {
      onFavoriteToggle(robot._id);
    } else {
      navigate('/login');
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          cursor: 'pointer',
        },
      }}
      onClick={handleCardClick}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 1)',
          },
        }}
        onClick={handleFavoriteClick}
      >
        {isFavorite ? (
          <Favorite sx={{ color: theme.palette.error.main }} />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      <CardMedia
        component="img"
        height="200"
        image={robot.images[0] || '/robot-placeholder.jpg'}
        alt={robot.title}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {robot.title}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h5"
            component="div"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            {formatPrice(robot.price)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={parseFloat(robot.rating)} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {robot.rating}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {robot.year} • {robot.mileage.toLocaleString()} hours
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip
            label={robot.manufacturer}
            size="small"
            sx={{
              bgcolor: theme.palette.primary.light,
              color: 'white',
              fontWeight: 500,
            }}
          />
          <Chip
            label={robot.condition}
            size="small"
            sx={{
              bgcolor: theme.palette.secondary.light,
              color: 'white',
              fontWeight: 500,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {robot.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RobotCard;
