import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip,
  useTheme,
} from '@mui/material';
import ImageLoader from '../common/ImageLoader';

const RobotCard = ({ robot }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Format the robot name to be more prominent
  const formatRobotName = (name) => {
    return name || 'Unnamed Robot';
  };

  // Format hours to be more readable
  const formatHours = (hours) => {
    return `${hours.toLocaleString()} operating hours`;
  };

  return (
    <Card
      onClick={() => navigate(`/robots/${robot.id}`)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          paddingTop: '75%', // 4:3 Aspect Ratio
          backgroundColor: 'grey.100',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <ImageLoader
          src={robot.image}
          alt={formatRobotName(robot.name)}
          category="listing"
          width="100%"
          height="100%"
          objectFit="cover"
          quality="medium"
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '8px 8px 0 0',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: theme.spacing(1),
            left: theme.spacing(1),
            right: theme.spacing(1),
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Chip
            label={robot.manufacturer}
            size="small"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
          <Chip
            label={robot.condition}
            size="small"
            color={robot.condition === 'New' ? 'success' : 'default'}
            sx={{
              bgcolor: robot.condition === 'New' 
                ? 'rgba(46, 125, 50, 0.9)'
                : 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: '1.1rem',
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {formatRobotName(robot.name)}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
            flexGrow: 1,
          }}
        >
          {robot.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={robot.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({robot.rating})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${robot.price.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {robot.year} • {formatHours(robot.mileage)}
            </Typography>
          </Box>
          <Chip
            label={robot.type || 'Trading Bot'}
            size="small"
            sx={{ bgcolor: theme.palette.grey[100] }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RobotCard;
