import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  AddCircle as AddCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import RobotCard from '../robots/RobotCard';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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
            image: 'https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-1024x576.jpg',
            description: 'Latest generation Tesla Optimus robot with enhanced mobility and AI capabilities.',
            rating: 4.9,
            condition: 'New'
          },
          {
            id: 2,
            name: 'Tesla Optimus Pro',
            price: 79999,
            image: 'https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-walking.jpg',
            description: 'Professional grade Tesla Optimus with advanced industrial applications.',
            rating: 4.8,
            condition: 'New'
          },
          {
            id: 3,
            name: 'Tesla Optimus Lite',
            price: 69999,
            image: 'https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-hands.jpg',
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
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-1024x576.jpg)`,
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Welcome to RoboTrader
            </Typography>
            <Typography
              variant="h5"
              color="inherit"
              paragraph
              sx={{
                maxWidth: '600px',
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Your premier marketplace for Tesla Optimus robots. Buy and sell the future of automation with confidence.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ExploreIcon />}
                onClick={() => navigate('/robots')}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.9),
                  },
                }}
              >
                Browse Robots
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<AddCircleIcon />}
                onClick={() => navigate('/create-listing')}
                sx={{
                  borderColor: '#fff',
                  color: '#fff',
                  '&:hover': {
                    borderColor: alpha('#fff', 0.9),
                    backgroundColor: alpha('#fff', 0.1),
                  },
                }}
              >
                Sell Your Robot
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Featured Robots Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Featured Robots
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Discover our top-rated Tesla Optimus robots, hand-picked for their exceptional quality and value.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {featuredRobots.map((robot) => (
            <Grid item xs={12} sm={6} md={4} key={robot.id}>
              <RobotCard robot={robot} />
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
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Why Choose RoboTrader?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Verified Sellers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All our sellers go through a rigorous verification process to ensure the highest quality standards.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Secure Transactions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your purchases are protected by our secure payment system and buyer protection program.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Expert Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our team of robot experts is available 24/7 to help you with any questions or concerns.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
