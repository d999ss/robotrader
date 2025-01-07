import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Speed as SpeedIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { getRandomImage } from '../../utils/imageUtils';
import ImageGallery from '../common/ImageGallery';
import ContactSeller from './ContactSeller';

const RobotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [robot, setRobot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRobotDetail = async () => {
      try {
        const response = await fetch(`/api/robots/${id}`);
        if (!response.ok) {
          throw new Error('Robot not found');
        }
        const data = await response.json();
        setRobot(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
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

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Image and Basic Info */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 2,
              mb: 3,
              backgroundColor: 'grey.100',
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            <Box
              component="img"
              src={robot.image}
              alt={robot.name}
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 1,
              }}
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {robot.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={robot.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({robot.rating} rating)
              </Typography>
            </Box>

            <Typography variant="body1" paragraph>
              {robot.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Price"
                  secondary={`$${robot.price.toLocaleString()}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Year"
                  secondary={robot.year}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SpeedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Usage"
                  secondary={`${robot.mileage.toLocaleString()} hours`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Right Column - Details and Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Manufacturer', value: robot.manufacturer },
                { label: 'Model', value: robot.model },
                { label: 'Condition', value: robot.condition },
                { label: 'Location', value: robot.location },
              ].map((spec, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {spec.label}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {spec.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setContactDialogOpen(true)}
          startIcon={<EmailIcon />}
        >
          Contact Seller
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/robots')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Listings
        </Button>
      </Box>

      {/* Contact Seller Dialog */}
      <ContactSeller
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        robotId={robot?.id}
        robotName={robot?.name}
      />
    </Container>
  );
};

export default RobotDetail;
