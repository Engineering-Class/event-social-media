// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error: any) {
      console.error('Forgot Password Error:', error);
      setMessage(error.response?.data?.message || 'Error sending password reset email.');
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
        Reset Password
      </Typography>
      <Typography variant="h6" gutterBottom>
        Enter your email to receive password reset instructions
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        onClick={handleForgotPassword}
        disabled={loading}
        sx={{ paddingY: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Email'}
      </Button>
      {message && (
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ForgotPasswordPage;
