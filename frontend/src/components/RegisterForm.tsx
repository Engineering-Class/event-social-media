// src/pages/RegisterPage.tsx
import React, { useState, useContext } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Link,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setEmailError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', { username, email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Register Error:', error);
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        padding: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Create Account
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please fill in the details
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputProps={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!emailError}
        helperText={emailError}
        InputProps={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        type="password"
        sx={{ marginBottom: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleRegister}
        disabled={loading}
        sx={{ paddingY: 1.5 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Register'
        )}
      </Button>
      <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
        Already have an account?{' '}
        <Link
          component={RouterLink}
          to="/login"
          sx={{ color: 'primary.main' }}
        >
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
