import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import RobotCard from './RobotCard';
import RobotSearch from './RobotSearch';
import { mockRobots } from '../../data/mockRobots';

const RobotList = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    manufacturer: 'All Manufacturers',
    condition: 'Any Condition',
    type: 'All Types',
    sortBy: 'Most Relevant',
  });

  // Filter robots based on search parameters
  const filteredRobots = mockRobots.filter(robot => {
    const matchesQuery = !searchParams.query || 
      robot.name.toLowerCase().includes(searchParams.query.toLowerCase()) ||
      robot.description.toLowerCase().includes(searchParams.query.toLowerCase()) ||
      robot.manufacturer.toLowerCase().includes(searchParams.query.toLowerCase());

    const matchesManufacturer = searchParams.manufacturer === 'All Manufacturers' ||
      robot.manufacturer === searchParams.manufacturer;

    const matchesCondition = searchParams.condition === 'Any Condition' ||
      robot.condition === searchParams.condition;

    const matchesType = searchParams.type === 'All Types' ||
      robot.type === searchParams.type;

    return matchesQuery && matchesManufacturer && matchesCondition && matchesType;
  });

  // Sort robots based on selected option
  const sortedRobots = [...filteredRobots].sort((a, b) => {
    switch (searchParams.sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Rating: High to Low':
        return b.rating - a.rating;
      case 'Year: Newest':
        return b.year - a.year;
      default:
        return 0;
    }
  });

  // Get unique values for filter options
  const manufacturers = ['All Manufacturers', ...new Set(mockRobots.map(robot => robot.manufacturer))];
  const conditions = ['Any Condition', ...new Set(mockRobots.map(robot => robot.condition))];
  const types = ['All Types', ...new Set(mockRobots.map(robot => robot.type))];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Available Trading Robots
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <RobotSearch
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            manufacturers={manufacturers}
            conditions={conditions}
            types={types}
          />
        </Paper>

        <Grid container spacing={3}>
          {sortedRobots.map((robot) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={robot.id}>
              <RobotCard robot={robot} />
            </Grid>
          ))}
          {sortedRobots.length === 0 && (
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No robots found matching your criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search filters
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default RobotList;
