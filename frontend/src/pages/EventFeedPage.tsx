import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  createdBy: {
    username: string;
  };
  image?: string; // Optional image field
}

const EventFeedPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events/feed');
        setEvents(response.data.events);
      } catch (err) {
        console.error('Failed to fetch event feed:', err);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  return (
<Box sx={{ padding: 4 }}>
  <Typography variant="h4" gutterBottom align="center">
    Event Feed
  </Typography>
  {events.map((event) => (
    <Card key={event._id} sx={{ marginBottom: 4, padding: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
      {/* Event Image */}
      {event.image && (
        <Box
          component="img"
          src={`http://localhost:5000/${event.image}`}
          alt={event.name}
          sx={{
            width: { xs: '100%', sm: '300px' }, // Adjust width for responsiveness
            height: 'auto',
            borderRadius: 2,
            marginBottom: { xs: 2, sm: 0 },
            marginRight: { sm: 3 },
            alignSelf: 'center', // Center image vertically with the details
          }}
        />
      )}

      {/* Event Details */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {event.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()} <strong>Time:</strong> {event.time}
        </Typography>
        <Typography variant="body2">
          <strong>Created By:</strong> {event.createdBy.username}
        </Typography>
      </Box>

      {/* Delete Button */}
      <CardActions sx={{ justifyContent: { xs: 'center', sm: 'flex-end' } }}>
        <Button onClick={() => handleDeleteEvent(event._id)} color="error" variant="outlined">
          Delete
        </Button>
      </CardActions>
    </Card>
  ))}
</Box>



  );
  
};

export default EventFeedPage;
