import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Find Your Perfect Match
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Whether you're looking for a room to rent or a roommate to share your space,
          Flatmates helps you find the perfect match with our Tinder-like interface.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {isAuthenticated ? (
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/swipe')}
                >
                  Start Swiping
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/matches')}
                >
                  View Matches
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>

      <Container sx={{ mt: 8, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Find a Room
              </Typography>
              <Typography>
                Browse through available rooms and find your perfect living space.
                Filter by location, price, and preferences.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Find a Roommate
              </Typography>
              <Typography>
                Looking for someone to share your space? Find compatible roommates
                based on lifestyle and preferences.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Easy Matching
              </Typography>
              <Typography>
                Swipe right to like, left to pass. Get notified when there's a match
                and start chatting with potential roommates.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 