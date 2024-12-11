import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Friend {
  _id: string;
  username: string;
  email: string;
}

const EventCreationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get('/friends');
        setFriends(response.data.friends);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      }
    };

    fetchFriends();
  }, []);

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
    formData.append('invitedFriends', JSON.stringify(invitedFriends));

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

  const handleFriendToggle = (friendId: string) => {
    setInvitedFriends((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
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
      <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
        Upload Image
        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
      </Button>
      {image && (
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Selected Image: {image.name}
        </Typography>
      )}
      <Typography variant="h6">Invite Friends</Typography>
      <List>
        {friends.map((friend) => (
          <ListItem key={friend._id}>
            <ListItemAvatar>
              <Avatar>{friend.username.charAt(0).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={friend.username} secondary={friend.email} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                checked={invitedFriends.includes(friend._id)}
                onChange={() => handleFriendToggle(friend._id)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleCreateEvent} sx={{ marginTop: 2 }}>
        Create Event
      </Button>
    </Box>
  );
};

export default EventCreationPage;
