import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface User {
  _id: string;
  username: string;
  email: string;
}

const FriendsAndProfilePage: React.FC = () => {
  const { user, login } = useContext(AuthContext);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState(user?.username || '');
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fetch friends and friend requests
  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const friendsResponse = await axiosInstance.get('/friends');
        const requestsResponse = await axiosInstance.get('/friends/requests');
        setFriends(friendsResponse.data.friends);
        setFriendRequests(requestsResponse.data.requests);
      } catch (error) {
        console.error('Failed to fetch friends or requests:', error);
      }
    };
    fetchFriendsAndRequests();
  }, []);

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axiosInstance.get(`/auth/search?query=${searchQuery}`);
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  // Send a friend request
  const handleAddFriend = async (userId: string) => {
    try {
      await axiosInstance.post('/friends/send-request', { userId });
      setSearchResults(searchResults.filter((user) => user._id !== userId));
      setSnackbarMessage('Friend request sent successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to send friend request:', error);
      setSnackbarMessage('Failed to send friend request.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Accept a friend request
  const handleAcceptRequest = async (userId: string) => {
    try {
      await axiosInstance.post('/friends/accept', { userId });
      setFriendRequests(friendRequests.filter((request) => request._id !== userId));
      const updatedFriend = friendRequests.find((request) => request._id === userId);
      if (updatedFriend) setFriends([...friends, updatedFriend]);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  // Decline a friend request
  const handleDeclineRequest = async (userId: string) => {
    try {
      await axiosInstance.post('/friends/decline', { userId });
      setFriendRequests(friendRequests.filter((request) => request._id !== userId));
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  // Remove a friend
  const handleRemoveFriend = async (userId: string) => {
    try {
      await axiosInstance.delete(`/friends/remove/${userId}`);
      setFriends(friends.filter((friend) => friend._id !== userId));
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };


  const handleProfileUpdate = async () => {
    try {
      const response = await axiosInstance.put('/auth/update-user', {
        username: updatedUsername,
        email: updatedEmail,
        password: password || undefined,
      });
      
      login(response.data.token, response.data.user);
      setEditing(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to update profile');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Friends & Profile
      </Typography>
      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Your Profile</Typography>
            {editing ? (
              <>
                <TextField
                  label="Username"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  value={updatedUsername}
                  onChange={(e) => setUpdatedUsername(e.target.value)}
                />
                <TextField
                  label="Email"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
                <TextField
                  label="Password (optional)"
                  type="password"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" onClick={handleProfileUpdate} sx={{ marginRight: 2 }}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1">
                  <strong>Username:</strong> {user?.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Button variant="contained" onClick={() => setEditing(true)} sx={{ marginTop: 2 }}>
                  Edit Profile
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        {/* Friends Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Friends</Typography>
            <List>
              {friends.map((friend) => (
                <ListItem
                  key={friend._id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFriend(friend._id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{friend.username.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={friend.username} secondary={friend.email} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Friend Requests Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Friend Requests</Typography>
            <List>
              {friendRequests.map((request) => (
                <ListItem
                  key={request._id}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        onClick={() => handleAcceptRequest(request._id)}
                        color="primary"
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeclineRequest(request._id)}
                        color="error"
                      >
                        <ClearIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{request.username.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={request.username} secondary={request.email} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Search Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Search for Friends</Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <TextField
                fullWidth
                label="Search Users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </Box>
            <List sx={{ marginTop: 2 }}>
              {searchResults.map((result) => (
                <ListItem
                  key={result._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleAddFriend(result._id)}
                      color="primary"
                    >
                      <PersonAddIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{result.username.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={result.username} secondary={result.email} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FriendsAndProfilePage;
