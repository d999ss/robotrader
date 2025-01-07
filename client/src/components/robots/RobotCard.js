import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
} from '@mui/material';

const RobotCard = ({ robot }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/robots/${robot.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1 }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="280"
            image={robot.image}
            alt={robot.name}
            sx={{
              objectFit: 'cover',
              backgroundColor: '#f8f9fa',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              {robot.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={robot.rating} precision={0.1} readOnly size="small" sx={{ color: 'white' }} />
              <Typography variant="body2" sx={{ color: 'white' }}>
                {robot.rating}
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            ${robot.price.toLocaleString()}
          </Typography>

          <Box sx={{ mb: 1.5 }}>
            <Chip 
              label={robot.type}
              size="small"
              sx={{ 
                mr: 1, 
                mb: 1,
                backgroundColor: 'primary.main',
                color: 'white',
              }}
            />
            <Chip 
              label={robot.condition}
              size="small"
              sx={{ 
                mr: 1, 
                mb: 1,
                backgroundColor: robot.condition === 'New' ? 'success.main' : 'grey.500',
                color: 'white',
              }}
            />
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {robot.description}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            {robot.features?.slice(0, 2).map((feature, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  '&:before': {
                    content: '"•"',
                    marginRight: 1,
                    color: 'primary.main'
                  }
                }}
              >
                {feature}
              </Typography>
            ))}
            {robot.features?.length > 2 && (
              <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                +{robot.features.length - 2} more features
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RobotCard;
