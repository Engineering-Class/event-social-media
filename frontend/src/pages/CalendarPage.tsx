import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const response = await axiosInstance.get(`/events?year=${year}&month=${month}`);
        setEvents(response.data.events);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };

    fetchEvents();
  }, []);

  const getCurrentMonthDays = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Calendar
      </Typography>
      <Grid container spacing={1} sx={{ marginTop: 2 }}>
        {getCurrentMonthDays().map((day) => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={day}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                height: '150px',
                borderRadius: 2,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden', // Ensure content doesn't overflow
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                {day}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto', // Add scroll for overflow
                  marginTop: 1,
                  padding: 1,
                  scrollbarWidth: 'thin', // For Firefox
                  '&::-webkit-scrollbar': {
                    width: '5px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '10px',
                  },
                }}
              >
                {events
                  .filter((event) => new Date(event.date).getDate() === day)
                  .map((event) => (
                    <Box
                      key={event._id}
                      sx={{
                        padding: 1,
                        marginBottom: 1,
                        backgroundColor: 'secondary.light',
                        color: 'secondary.contrastText',
                        borderRadius: 1,
                        cursor: 'pointer',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {event.name}
                      </Typography>
                      <Typography variant="caption">{event.time}</Typography>
                    </Box>
                  ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedEvent} onClose={handleCloseDialog}>
        <DialogTitle>Event Details</DialogTitle>
        {selectedEvent && (
          <DialogContent>
            <Typography variant="h6">{selectedEvent.name}</Typography>
            <Typography variant="body1">{selectedEvent.description}</Typography>
            <Typography variant="body2">
              Date: {new Date(selectedEvent.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">Time: {selectedEvent.time}</Typography>
            <Typography variant="body2">
              Created By: {selectedEvent.createdBy.username}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;
