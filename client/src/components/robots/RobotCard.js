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
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="200"
          image={robot.image}
          alt={robot.name}
          sx={{
            objectFit: 'contain',
            backgroundColor: '#f5f5f5',
            p: 2
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {robot.name}
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Rating value={robot.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
              {robot.rating}
            </Typography>
          </Box>

          <Typography variant="h6" color="primary" gutterBottom>
            ${robot.price.toLocaleString()}
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Chip 
              label={robot.type}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip 
              label={robot.condition}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {robot.description}
          </Typography>

          <Box sx={{ mt: 2 }}>
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
              <Typography variant="body2" color="primary">
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
