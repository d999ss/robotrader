import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Grid,
  CircularProgress,
} from '@mui/material';
import RobotCard from '../robots/RobotCard';

const UserProfile = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user's listings
      const listingsResponse = await fetch('/api/robots/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const listingsData = await listingsResponse.json();
      setMyListings(listingsData);

      // Fetch user's favorites
      const favoritesResponse = await fetch('/api/users/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const favoritesData = await favoritesResponse.json();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {user?.name}'s Profile
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="My Listings" />
            <Tab label="Favorites" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Grid container spacing={3}>
            {myListings.map(robot => (
              <Grid item xs={12} sm={6} md={4} key={robot._id}>
                <RobotCard robot={robot} />
              </Grid>
            ))}
            {myListings.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" align="center">
                  You haven't created any listings yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {tab === 1 && (
          <Grid container spacing={3}>
            {favorites.map(robot => (
              <Grid item xs={12} sm={6} md={4} key={robot._id}>
                <RobotCard robot={robot} />
              </Grid>
            ))}
            {favorites.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" align="center">
                  You haven't added any robots to your favorites yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
