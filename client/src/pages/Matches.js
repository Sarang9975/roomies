import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profiles/matches');
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch matches');
      setLoading(false);
    }
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMatch(null);
  };

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

  if (matches.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" gutterBottom>
            No matches yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep swiping to find your perfect match!
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Matches
      </Typography>
      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} sm={6} md={4} key={match._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
              onClick={() => handleMatchClick(match)}
            >
              <CardMedia
                component="img"
                height="200"
                image={match.profile.photos[0] || 'https://via.placeholder.com/400x300'}
                alt={match.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {match.name}, {match.profile.age}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {match.profile.occupation}
                </Typography>
                {user.userType === 'room_seeker' && match.roomDetails && (
                  <Box mt={1}>
                    <Typography variant="body2">
                      {match.roomDetails.type} - ${match.roomDetails.rent}/month
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedMatch && (
          <>
            <DialogTitle>
              {selectedMatch.name}, {selectedMatch.profile.age}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  About
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedMatch.profile.bio}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Occupation
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedMatch.profile.occupation}
                </Typography>

                {user.userType === 'room_seeker' && selectedMatch.roomDetails && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Room Details
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Type: {selectedMatch.roomDetails.type}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Rent: ${selectedMatch.roomDetails.rent}/month
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Address: {selectedMatch.roomDetails.address}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedMatch.roomDetails.description}
                    </Typography>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  // Implement chat functionality here
                  alert('Chat feature coming soon!');
                }}
              >
                Start Chat
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Matches; 