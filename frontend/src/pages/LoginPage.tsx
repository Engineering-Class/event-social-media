// src/pages/LoginPage.tsx
import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Link } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { token, user } = response.data;

      // Persist session and navigate to dashboard
      login(token, user);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login Error:', error);
      setMessage(error.response?.data?.message || 'Invalid credentials');
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
        margin: '0 auto',
        marginTop: 8,
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome Back!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please login to your account
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
        onClick={handleLogin}
        disabled={loading}
        sx={{ paddingY: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>
      {message && (
        <Typography
          variant="body2"
          align="center"
          sx={{
            marginTop: 2,
            color: message.includes('successfully') ? 'success.main' : 'error.main',
          }}
        >
          {message}
        </Typography>
      )}
      <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
        Don't have an account?{' '}
        <Link component={RouterLink} to="/register" sx={{ color: 'primary.main' }}>
          Register
        </Link>
      </Typography>
      <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
        Forgot your password?{' '}
        <Link component={RouterLink} to="/request-reset-password" sx={{ color: 'primary.main' }}>
          Reset Password
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;
