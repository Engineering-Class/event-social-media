import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
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
        <Card key={event._id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{event.name}</Typography>
            <Typography variant="body1">{event.description}</Typography>
            <Typography variant="body2">
              Date: {new Date(event.date).toLocaleDateString()} Time: {event.time}
            </Typography>
            <Typography variant="body2">Created By: {event.createdBy.username}</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => handleDeleteEvent(event._id)} color="error">
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default EventFeedPage;
