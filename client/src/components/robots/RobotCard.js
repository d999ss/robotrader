import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const RobotCard = ({ robot, onFavoriteToggle, isFavorite }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (user) {
      onFavoriteToggle(robot._id);
    } else {
      navigate('/login');
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3,
        }
      }}
      onClick={() => navigate(`/robots/${robot._id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={robot.images[0] || '/robot-placeholder.jpg'}
        alt={robot.title}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {robot.title}
          </Typography>
          <IconButton 
            onClick={handleFavoriteClick}
            color="primary"
            sx={{ padding: 0.5 }}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        <Typography variant="h6" color="primary" gutterBottom>
          ${robot.price.toLocaleString()}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Chip 
            label={robot.condition} 
            size="small" 
            sx={{ mr: 1 }}
          />
          <Chip 
            label={robot.manufacturer} 
            size="small" 
          />
        </Box>

        <Typography variant="body2" color="text.secondary" noWrap>
          {robot.description}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {new Date(robot.createdAt).toLocaleDateString()}
          </Typography>
          <Button 
            size="small" 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/robots/${robot._id}`);
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RobotCard;
