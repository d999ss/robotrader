import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  AddCircle as AddCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import RobotCard from '../robots/RobotCard';
import { getRandomImage, ROBOT_IMAGES, getCategoryConfig, handleImageError } from '../../utils/imageUtils';
import ImageLoader from '../common/ImageLoader';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const heroConfig = getCategoryConfig('hero');
  const [featuredRobots, setFeaturedRobots] = useState([]);

  useEffect(() => {
    // Fetch featured robots
    const fetchFeaturedRobots = async () => {
      try {
        const response = await fetch('/api/robots/featured');
        const data = await response.json();
        setFeaturedRobots(data.slice(0, 3)); // Show top 3 featured robots
      } catch (error) {
        console.error('Error fetching featured robots:', error);
        // Use mock data if API fails
        setFeaturedRobots([
          {
            id: 1,
            name: 'Tesla Optimus Gen 2',
            price: 89999,
            image: ROBOT_IMAGES.featured[0],
            description: 'Latest generation Tesla Optimus robot with enhanced mobility and AI capabilities.',
            rating: 4.9,
            condition: 'New'
          },
          {
            id: 2,
            name: 'Tesla Optimus Pro',
            price: 79999,
            image: ROBOT_IMAGES.featured[1],
            description: 'Professional grade Tesla Optimus with advanced industrial applications.',
            rating: 4.8,
            condition: 'New'
          },
          {
            id: 3,
            name: 'Tesla Optimus Lite',
            price: 69999,
            image: ROBOT_IMAGES.featured[2],
            description: 'Entry-level Tesla Optimus perfect for home and small business use.',
            rating: 4.7,
            condition: 'New'
          }
        ]);
      }
    };

    fetchFeaturedRobots();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
        }}
      >
        {/* Hero Background Image */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <ImageLoader
            src={ROBOT_IMAGES.hero[0]}
            alt="RoboTrader Hero"
            category="hero"
            width="100%"
            height="100%"
            objectFit="cover"
            quality="high"
            priority={true}
          />
        </Box>

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ color: 'white', textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to RoboTrader
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Your Marketplace for Advanced Trading Robots
            </Typography>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/robots')}
                sx={{ minWidth: 200 }}
              >
                Browse Robots
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/create-listing')}
                sx={{ minWidth: 200, color: 'white', borderColor: 'white' }}
              >
                Sell Your Robot
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Robots Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Featured Robots
        </Typography>
        <Grid container spacing={4}>
          {featuredRobots.map((robot) => (
            <Grid item xs={12} sm={6} md={4} key={robot.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[10],
                  },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
                  <ImageLoader
                    src={robot.image}
                    alt={`Featured Robot ${robot.name}`}
                    category="featured"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    quality="high"
                    priority={true}
                    sx={{ position: 'absolute', top: 0, left: 0 }}
                  />
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {robot.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {robot.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/robots')}
          >
            View All Robots
          </Button>
        </Box>
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Why Choose RoboTrader?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Verified Sellers',
                description: 'All our sellers go through a strict verification process',
              },
              {
                title: 'Secure Transactions',
                description: 'Your transactions are protected with bank-level security',
              },
              {
                title: 'Expert Support',
                description: '24/7 support from our team of trading experts',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    },
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
