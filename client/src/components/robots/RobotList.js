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

const ROBOT_TYPES = [
  'All Types',
  'Industrial',
  'Service',
  'Companion',
  'Medical',
  'Educational',
];

const MANUFACTURERS = [
  'All Manufacturers',
  'Boston Dynamics',
  'ABB',
  'FANUC',
  'KUKA',
  'Universal Robots',
];

const CONDITIONS = [
  'Any Condition',
  'New',
  'Like New',
  'Excellent',
  'Good',
  'Fair',
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Listings' },
];

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
    type: '',
    sortBy: 'relevance',
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
      type: params.get('type') || '',
      sortBy: params.get('sortBy') || 'relevance',
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
      if (debouncedFilters.sortBy) queryParams.append('sortBy', debouncedFilters.sortBy);
      
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
                  {MANUFACTURERS.map(manufacturer => (
                    <MenuItem key={manufacturer} value={manufacturer === 'All Manufacturers' ? '' : manufacturer.toLowerCase().replace(' ', '-')}>{manufacturer}</MenuItem>
                  ))}
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
                  {CONDITIONS.map(condition => (
                    <MenuItem key={condition} value={condition === 'Any Condition' ? '' : condition.toLowerCase().replace(' ', '-')}>{condition}</MenuItem>
                  ))}
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
                  {ROBOT_TYPES.map(type => (
                    <MenuItem key={type} value={type === 'All Types' ? '' : type.toLowerCase()}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  label="Sort By"
                >
                  {SORT_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
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
