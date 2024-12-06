import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Event Management Dashboard
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        Manage your events with ease! Create events, view them on a calendar, and keep track of important dates.
      </Typography>
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h6">View Calendar</Typography>
          <Typography variant="body2">
            Check your events in an interactive calendar view.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => navigate('/calendar')}>
            Go to Calendar
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">Create an Event</Typography>
          <Typography variant="body2">
            Add new events to your calendar and share with others.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => navigate('/create-event')}>
            Create Event
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Dashboard;
