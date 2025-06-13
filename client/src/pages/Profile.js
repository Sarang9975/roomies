import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    profile: {
      age: '',
      gender: '',
      occupation: '',
      bio: '',
      interests: [],
      location: {
        coordinates: [0, 0]
      },
      preferences: {
        budget: {
          min: '',
          max: ''
        },
        roommates: {
          gender: '',
          ageRange: {
            min: '',
            max: ''
          }
        }
      }
    },
    roomDetails: {
      type: '',
      address: '',
      rent: '',
      availableFrom: '',
      amenities: [],
      description: ''
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Deep merge the user data with default values
      setFormData(prevData => ({
        profile: {
          ...prevData.profile,
          ...(user.profile || {}),
          preferences: {
            ...prevData.profile.preferences,
            ...(user.profile?.preferences || {}),
            budget: {
              ...prevData.profile.preferences.budget,
              ...(user.profile?.preferences?.budget || {})
            },
            roommates: {
              ...prevData.profile.preferences.roommates,
              ...(user.profile?.preferences?.roommates || {}),
              ageRange: {
                ...prevData.profile.preferences.roommates.ageRange,
                ...(user.profile?.preferences?.roommates?.ageRange || {})
              }
            }
          },
          location: {
            ...prevData.profile.location,
            ...(user.profile?.location || {})
          }
        },
        roomDetails: {
          ...prevData.roomDetails,
          ...(user.roomDetails || {})
        }
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.put('http://localhost:5000/api/profiles/profile', formData);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="profile.age"
                type="number"
                value={formData.profile.age || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="profile.gender"
                  value={formData.profile.gender || ''}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Occupation"
                name="profile.occupation"
                value={formData.profile.occupation || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="profile.bio"
                multiline
                rows={4}
                value={formData.profile.bio || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Budget"
                name="profile.preferences.budget.min"
                type="number"
                value={formData.profile.preferences.budget.min || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Budget"
                name="profile.preferences.budget.max"
                type="number"
                value={formData.profile.preferences.budget.max || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          {user?.userType === 'room_provider' && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Room Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      name="roomDetails.type"
                      value={formData.roomDetails.type || ''}
                      onChange={handleChange}
                      label="Room Type"
                    >
                      <MenuItem value="apartment">Apartment</MenuItem>
                      <MenuItem value="house">House</MenuItem>
                      <MenuItem value="studio">Studio</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rent"
                    name="roomDetails.rent"
                    type="number"
                    value={formData.roomDetails.rent || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="roomDetails.address"
                    value={formData.roomDetails.address || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="roomDetails.description"
                    multiline
                    rows={4}
                    value={formData.roomDetails.description || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile; 