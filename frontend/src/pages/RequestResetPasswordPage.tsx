// src/pages/RequestResetPasswordPage.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

const RequestResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRequestReset = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/request-reset-password', { email });
      setMessage(response.data.message);
    } catch (error: any) {
      console.error('Request Reset Error:', error);
      setMessage(error.response?.data?.message || 'Error requesting password reset');
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
        Enter your email to reset your password
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
        onClick={handleRequestReset}
        disabled={loading}
        sx={{ paddingY: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Email'}
      </Button>
      {message && (
        <Typography variant="body2" align="center" sx={{ marginTop: 2, color: message.includes('sent') ? 'success.main' : 'error.main' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default RequestResetPasswordPage;
