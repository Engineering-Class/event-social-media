// Add imports for Menu and MenuItem if not already present
import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Badge,
  InputBase,
  Box,
  Menu,
  MenuItem,
  ListItemText,
  ListItemAvatar,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import axiosInstance from '../api/axiosInstance';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          MyApp
        </Typography>

        {isAuthenticated && (
          <>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Avatar>{user?.username?.charAt(0).toUpperCase() || '?'}</Avatar>
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                style: {
                  width: '200px',
                },
              }}
            >
            <MenuItem onClick={() => navigate('/friends-profile')}>
                Friends & Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/event-feed'); handleProfileMenuClose(); }}>
                Event Feed
              </MenuItem>
              <MenuItem onClick={() => { logout(); navigate('/login'); handleProfileMenuClose(); }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
