import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import RobotCard from './RobotCard';
import config from '../../config';

const RobotList = () => {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    manufacturer: '',
    condition: '',
    priceRange: '',
    type: ''
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [filters]);

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters = {
      search: params.get('search') || '',
      manufacturer: params.get('manufacturer') || '',
      condition: params.get('condition') || '',
      priceRange: params.get('priceRange') || '',
      type: params.get('type') || ''
    };
    setFilters(newFilters);
  }, []);

  const fetchRobots = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${config.API_URL}/api/robots`;
      const queryParams = new URLSearchParams();
      
      if (debouncedFilters.search) queryParams.append('search', debouncedFilters.search);
      if (debouncedFilters.manufacturer) queryParams.append('manufacturer', debouncedFilters.manufacturer);
      if (debouncedFilters.condition) queryParams.append('condition', debouncedFilters.condition);
      if (debouncedFilters.priceRange) queryParams.append('priceRange', debouncedFilters.priceRange);
      if (debouncedFilters.type) queryParams.append('type', debouncedFilters.type);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      console.log('Fetching robots from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch robots: ${response.status} ${responseText}`);
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('Parsed robots data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Expected array of robots, got:', typeof data);
        throw new Error('Invalid data format from server');
      }
      
      setRobots(data);
      setError('');
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${config.API_URL}/api/users/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      setFavorites(data.map(fav => fav._id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  }, []);

  useEffect(() => {
    fetchRobots();
    fetchFavorites();
  }, [fetchRobots, fetchFavorites]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchRobots();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Available Robots
        </Typography>
        
        <Paper 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            p: 3, 
            mb: 4,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Robots"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="Search by name, manufacturer, or features..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Manufacturer</InputLabel>
                <Select
                  name="manufacturer"
                  value={filters.manufacturer}
                  onChange={handleFilterChange}
                  label="Manufacturer"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Boston Dynamics">Boston Dynamics</MenuItem>
                  <MenuItem value="FANUC">FANUC</MenuItem>
                  <MenuItem value="KUKA">KUKA</MenuItem>
                  <MenuItem value="ABB">ABB</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  label="Condition"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Like New">Like New</MenuItem>
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  label="Price Range"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="0-1000">$0 - $1,000</MenuItem>
                  <MenuItem value="1000-5000">$1,000 - $5,000</MenuItem>
                  <MenuItem value="5000-10000">$5,000 - $10,000</MenuItem>
                  <MenuItem value="10000-50000">$10,000 - $50,000</MenuItem>
                  <MenuItem value="50000+">$50,000+</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Service">Service</MenuItem>
                  <MenuItem value="Autonomous">Autonomous</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  height: '56px',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {robots.map(robot => (
          <Grid item xs={12} sm={6} md={4} key={robot._id}>
            <RobotCard
              robot={robot}
              isFavorite={favorites.includes(robot._id)}
            />
          </Grid>
        ))}
        {robots.length === 0 && (
          <Grid item xs={12}>
            <Typography 
              variant="body1" 
              color="textSecondary" 
              align="center"
              sx={{ mt: 4 }}
            >
              No robots found matching your criteria.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default RobotList;
