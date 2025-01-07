import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the background image
  React.useEffect(() => {
    const img = new Image();
    img.src = BACKGROUND_IMAGE_URL;
    img.onload = () => setImageLoaded(true);
  }, []);

  const [searchParams, setSearchParams] = useState({
    type: '',
    priceRange: '',
    manufacturer: '',
    condition: '',
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    navigate(`/robots?${queryParams.toString()}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: '70vh',
          position: 'relative',
          backgroundColor: theme.palette.grey[900], // Fallback color
          ...(imageLoaded && {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${BACKGROUND_IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          transition: 'opacity 0.3s ease-in-out',
          opacity: imageLoaded ? 1 : 0.9,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 4,
              fontSize: isMobile ? '2.5rem' : '3.5rem',
            }}
          >
            Find Your Perfect Robot
          </Typography>

          {/* Search Form */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={searchParams.type}
                    onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                    <MenuItem value="service">Service</MenuItem>
                    <MenuItem value="companion">Companion</MenuItem>
                    <MenuItem value="medical">Medical</MenuItem>
                    <MenuItem value="educational">Educational</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={searchParams.priceRange}
                    onChange={(e) => setSearchParams({ ...searchParams, priceRange: e.target.value })}
                    label="Price Range"
                  >
                    <MenuItem value="">Any Price</MenuItem>
                    <MenuItem value="0-1000">Under $1,000</MenuItem>
                    <MenuItem value="1000-5000">$1,000 - $5,000</MenuItem>
                    <MenuItem value="5000-10000">$5,000 - $10,000</MenuItem>
                    <MenuItem value="10000-50000">$10,000 - $50,000</MenuItem>
                    <MenuItem value="50000-100000">$50,000+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Manufacturer</InputLabel>
                  <Select
                    value={searchParams.manufacturer}
                    onChange={(e) => setSearchParams({ ...searchParams, manufacturer: e.target.value })}
                    label="Manufacturer"
                  >
                    <MenuItem value="">All Manufacturers</MenuItem>
                    <MenuItem value="boston-dynamics">Boston Dynamics</MenuItem>
                    <MenuItem value="abb">ABB</MenuItem>
                    <MenuItem value="fanuc">FANUC</MenuItem>
                    <MenuItem value="kuka">KUKA</MenuItem>
                    <MenuItem value="universal-robots">Universal Robots</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={searchParams.condition}
                    onChange={(e) => setSearchParams({ ...searchParams, condition: e.target.value })}
                    label="Condition"
                  >
                    <MenuItem value="">Any Condition</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="like-new">Like New</MenuItem>
                    <MenuItem value="excellent">Excellent</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="fair">Fair</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{
                    mt: 2,
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    height: 56,
                    fontSize: '1.1rem',
                  }}
                >
                  Search Robots
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Featured Sections */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Popular Categories */}
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Popular Categories
            </Typography>
            <Grid container spacing={2}>
              {[
                { title: 'Industrial Robots', image: 'industrial.jpg', type: 'industrial' },
                { title: 'Service Robots', image: 'service.jpg', type: 'service' },
                { title: 'Companion Robots', image: 'companion.jpg', type: 'companion' },
                { title: 'Medical Robots', image: 'medical.jpg', type: 'medical' },
              ].map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category.title}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                    onClick={() => navigate(`/robots?type=${category.type}`)}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {category.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Research & Reviews */}
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Research & Reviews
            </Typography>
            <Grid container spacing={3}>
              {[
                'Top Rated Industrial Robots',
                'Best Companion Robots for 2025',
                'Medical Robot Reviews',
                'Educational Robot Guide',
              ].map((title) => (
                <Grid item xs={12} sm={6} md={3} key={title}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: theme.palette.grey[50],
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Read our comprehensive guide and reviews
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
