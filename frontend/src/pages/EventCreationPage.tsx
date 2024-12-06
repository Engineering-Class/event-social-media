import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EventCreationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCreateEvent = async () => {
    if (!name || !description || !date) {
      setError('All fields are required');
      return;
    }

    try {
      await axiosInstance.post('/events/create', { name, description, date });
      setSuccess(true);
      setTimeout(() => navigate('/calendar'), 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event');
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Create Event
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">Event created successfully!</Typography>}
      <TextField
        label="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" onClick={handleCreateEvent}>
        Create Event
      </Button>
    </Box>
  );
};

export default EventCreationPage;
