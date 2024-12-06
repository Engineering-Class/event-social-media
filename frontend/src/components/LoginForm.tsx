// src/components/LoginForm.tsx
import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { token, _id, username: userUsername } = response.data;
      login(token, {
        _id, username: userUsername,
        email: ''
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        type="password"
        sx={{ marginBottom: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
