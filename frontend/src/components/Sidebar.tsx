import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? 240 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? 240 : 0,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" align="center">
            Event Manager
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/calendar')}>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/create-event')}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Create Event" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/events-feed')}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Event Feed" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
