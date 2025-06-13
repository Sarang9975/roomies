import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Swipe = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profiles/potential-matches');
      setProfiles(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch profiles');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/profiles/like/${profiles[currentIndex]._id}`);
      if (response.data.isMatch) {
        // Show match notification
        alert('It\'s a match! 🎉');
      }
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handleDislike = async () => {
    if (currentIndex >= profiles.length) return;

    try {
      await axios.post(`http://localhost:5000/api/profiles/dislike/${profiles[currentIndex]._id}`);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error disliking profile:', error);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleDislike,
    onSwipedRight: handleLike,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400
          }}
        >
          <Typography variant="h5" gutterBottom>
            No more profiles to show
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for new matches!
          </Typography>
        </Paper>
      </Box>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        {...handlers}
        sx={{
          position: 'relative',
          height: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            height: '100%',
            position: 'relative',
            cursor: 'grab'
          }}
        >
          <CardMedia
            component="img"
            height="60%"
            image={currentProfile.profile.photos[0] || 'https://via.placeholder.com/400x600'}
            alt={currentProfile.name}
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {currentProfile.name}, {currentProfile.profile.age}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {currentProfile.profile.occupation}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentProfile.profile.bio}
            </Typography>
            {user.userType === 'room_seeker' && currentProfile.roomDetails && (
              <Box mt={2}>
                <Typography variant="subtitle1">
                  Room Details:
                </Typography>
                <Typography variant="body2">
                  {currentProfile.roomDetails.type} - ${currentProfile.roomDetails.rent}/month
                </Typography>
                <Typography variant="body2">
                  {currentProfile.roomDetails.address}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        gap={2}
        mt={2}
      >
        <IconButton
          color="error"
          size="large"
          onClick={handleDislike}
          sx={{ bgcolor: 'background.paper' }}
        >
          <ThumbDownIcon />
        </IconButton>
        <IconButton
          color="primary"
          size="large"
          onClick={handleLike}
          sx={{ bgcolor: 'background.paper' }}
        >
          <ThumbUpIcon />
        </IconButton>
        <IconButton
          color="info"
          size="large"
          sx={{ bgcolor: 'background.paper' }}
        >
          <InfoIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default Swipe; 