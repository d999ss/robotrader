import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Paper,
  Rating,
  Typography,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import SpeedIcon from '@mui/icons-material/Speed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const RobotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [robot, setRobot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRobotDetail = async () => {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        // This would be replaced with actual API call
        const mockRobot = {
          id: parseInt(id),
          name: `Tesla ${id}`,
          type: 'Industrial',
          manufacturer: 'Tesla Robotics',
          price: 75000,
          condition: 'Like New',
          rating: 4.5,
          image: 'https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-1024x576.jpg',
          description: 'Advanced Tesla robotics solution featuring state-of-the-art AI capabilities, enhanced mobility, and industry-leading performance metrics.',
          year: 2024,
          mileage: 1200,
          specs: {
            height: '5.8 ft',
            weight: '126 lbs',
            battery: '12 hours',
            speed: '5.2 mph',
            payload: '45 lbs',
            precision: '0.1 mm'
          },
          features: [
            'Advanced AI Processing',
            'Natural Movement',
            'Human-like Dexterity',
            'Voice Recognition',
            'Real-time Learning',
            'Safety Protocols',
            'Remote Management',
            'Predictive Maintenance'
          ]
        };
        setRobot(mockRobot);
        setLoading(false);
      }, 1000);
    };

    fetchRobotDetail();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!robot) {
    return (
      <Container>
        <Typography>Robot not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/robots')}
        sx={{ mb: 3 }}
      >
        Back to Listings
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Image and Basic Info */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height="500"
              image={robot.image}
              alt={robot.name}
              sx={{
                objectFit: 'cover',
                backgroundColor: '#000',
              }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {robot.name}
                </Typography>
                <Typography variant="h4" component="p" color="primary">
                  ${robot.price.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={robot.type} color="primary" />
                <Chip label={robot.condition} color="secondary" />
                <Rating value={parseFloat(robot.rating)} precision={0.5} readOnly />
              </Box>
              <Typography variant="body1" paragraph>
                {robot.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Specs and Features */}
        <Grid item xs={12} md={4}>
          {/* Key Stats */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Year
                    </Typography>
                    <Typography variant="body1">
                      {robot.year}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Usage Hours
                    </Typography>
                    <Typography variant="body1">
                      {robot.mileage}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BuildIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Condition
                    </Typography>
                    <Typography variant="body1">
                      {robot.condition}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShippingIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Manufacturer
                    </Typography>
                    <Typography variant="body1">
                      {robot.manufacturer}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Technical Specs */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Technical Specifications
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(robot.specs).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <Typography variant="body2" color="text.secondary">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                  <Typography variant="body1">
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Features */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Grid container spacing={1}>
              {robot.features.map((feature, index) => (
                <Grid item xs={12} key={index}>
                  <Chip
                    label={feature}
                    sx={{ width: '100%' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Contact Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            startIcon={<AttachMoneyIcon />}
          >
            Contact Seller
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RobotDetail;
