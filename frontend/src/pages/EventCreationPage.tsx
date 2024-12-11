import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EventCreationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreateEvent = async () => {
    if (!name || !description || !date || !time) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('time', time);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axiosInstance.post('/events/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      <TextField
        label="Time"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" component="label" >
        Upload Picture
        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
      </Button>
      {image && (
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Selected Image: {image.name}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={handleCreateEvent}>
        Create Event
      </Button>
    </Box>
  );
};

export default EventCreationPage;
