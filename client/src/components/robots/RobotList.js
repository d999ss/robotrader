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

const TESLA_LOCATIONS = [
  'Tesla California',
  'Tesla Texas',
  'Tesla Nevada',
  'Tesla New York',
  'Tesla Shanghai',
  'Tesla Berlin',
  'Tesla Arizona',
  'Tesla Florida',
  'Tesla Washington',
  'Tesla Oregon',
  'Tesla Colorado',
  'Tesla Illinois',
  'Tesla Michigan',
  'Tesla Ohio',
  'Tesla Pennsylvania',
  'Tesla Virginia',
  'Tesla Maryland',
  'Tesla Massachusetts',
  'Tesla Connecticut',
  'Tesla New Jersey',
  'Tesla Minnesota',
  'Tesla Wisconsin',
  'Tesla Indiana',
  'Tesla Tennessee',
  'Tesla Kentucky',
  'Tesla Georgia',
  'Tesla Alabama',
  'Tesla Mississippi',
  'Tesla Louisiana',
  'Tesla Oklahoma',
  'Tesla Kansas',
  'Tesla Nebraska',
  'Tesla Iowa',
  'Tesla Missouri',
  'Tesla Arkansas',
  'Tesla South Carolina',
  'Tesla North Carolina',
  'Tesla Delaware',
  'Tesla Rhode Island',
  'Tesla New Hampshire',
  'Tesla Maine',
  'Tesla Vermont',
  'Tesla Montana',
  'Tesla Idaho',
  'Tesla Wyoming',
  'Tesla South Dakota',
  'Tesla North Dakota',
  'Tesla New Mexico',
  'Tesla Hawaii',
  'Tesla Alaska'
];

const TESLA_OPTIMUS_IMAGES = [
  'https://www.teslarati.com/wp-content/uploads/2022/10/tesla-optimus-white-1024x576.jpg',
  'https://www.teslarati.com/wp-content/uploads/2022/10/tesla-bot-optimus-1-1024x576.jpg',
  'https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-1024x576.jpg',
  'https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-walking.jpg',
  'https://www.teslarati.com/wp-content/uploads/2023/12/tesla-optimus-gen-2-hands.jpg'
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
    priceRange: [0, 100000],
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
      priceRange: params.get('priceRange') || [0, 100000],
      type: params.get('type') || '',
      sortBy: params.get('sortBy') || 'relevance',
    };
    setFilters(newFilters);
  }, []);

  // Filter robots based on current filters
  const getFilteredRobots = (robots, filters) => {
    console.log('Filtering robots:', { robots, filters });
    return robots.filter(robot => {
      // Type filter - only apply if a specific type is selected
      if (filters.type && filters.type !== '' && filters.type !== 'all') {
        if (robot.type !== filters.type) {
          return false;
        }
      }

      // Price range filter - only apply if valid range is provided
      if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
        const price = parseFloat(robot.price);
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }
      }

      // Manufacturer filter - only apply if specific manufacturer is selected
      if (filters.manufacturer && filters.manufacturer !== '' && filters.manufacturer !== 'all') {
        if (robot.manufacturer !== filters.manufacturer) {
          return false;
        }
      }

      // Condition filter - only apply if specific condition is selected
      if (filters.condition && filters.condition !== '' && filters.condition !== 'all') {
        if (robot.condition !== filters.condition) {
          return false;
        }
      }

      return true;
    });
  };

  // Sort robots based on current sort option
  const getSortedRobots = (robots, sortBy) => {
    console.log('Sorting robots:', { robots, sortBy });
    const sortedRobots = [...robots];
    switch (sortBy) {
      case 'price_asc':
        return sortedRobots.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sortedRobots.sort((a, b) => b.price - a.price);
      case 'rating_desc':
        return sortedRobots.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      case 'newest':
        return sortedRobots.sort((a, b) => b.year - a.year);
      default: // 'relevance'
        return sortedRobots;
    }
  };

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchRobots = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockRobots = TESLA_LOCATIONS.map((location, i) => ({
          id: i + 1,
          name: location,
          type: ROBOT_TYPES[Math.floor(Math.random() * (ROBOT_TYPES.length - 1)) + 1],
          manufacturer: MANUFACTURERS[Math.floor(Math.random() * (MANUFACTURERS.length - 1)) + 1],
          price: Math.floor(Math.random() * 90000) + 10000,
          condition: CONDITIONS[Math.floor(Math.random() * (CONDITIONS.length - 1)) + 1],
          rating: (Math.random() * 2 + 3).toFixed(1),
          image: TESLA_OPTIMUS_IMAGES[Math.floor(Math.random() * TESLA_OPTIMUS_IMAGES.length)],
          description: `Advanced ${location} robotics solution featuring Tesla's Optimus technology with state-of-the-art AI capabilities, enhanced mobility, and industry-leading performance metrics.`,
          year: Math.floor(Math.random() * (2026 - 2023)) + 2023,
          mileage: Math.floor(Math.random() * 5000),
        }));

        console.log('Generated mock robots:', mockRobots);

        // Apply filters and sorting
        let filteredRobots = getFilteredRobots(mockRobots, filters);
        console.log('After filtering:', filteredRobots);
        
        // If no results after filtering, show all robots
        if (filteredRobots.length === 0) {
          console.log('No results found, showing all robots');
          filteredRobots = mockRobots;
        }
        
        filteredRobots = getSortedRobots(filteredRobots, filters.sortBy);
        console.log('After sorting:', filteredRobots);
        
        setRobots(filteredRobots);
        setLoading(false);
      }, 1000);
    };

    fetchRobots();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log('Filter changed:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // fetchRobots();
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
                onChange={(event) => handleFilterChange({ search: event.target.value })}
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
                  onChange={(event) => handleFilterChange({ manufacturer: event.target.value })}
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
                  onChange={(event) => handleFilterChange({ condition: event.target.value })}
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
                  onChange={(event) => handleFilterChange({ type: event.target.value })}
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
                  onChange={(event) => handleFilterChange({ sortBy: event.target.value })}
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
          <Grid item xs={12} sm={6} md={4} key={robot.id}>
            <RobotCard
              robot={robot}
              isFavorite={favorites.includes(robot.id)}
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
