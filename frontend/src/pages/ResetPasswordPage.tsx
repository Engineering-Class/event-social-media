// src/pages/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const query = new URLSearchParams(location.search);
  const token = query.get('token') || '';

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/reset-password', { password, token });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      setMessage(error.response?.data?.message || 'Error resetting password');
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
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Set New Password
      </Typography>
      <Typography variant="h6" gutterBottom>
        Enter your new password
      </Typography>
      <TextField
        label="New Password"
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
        onClick={handleResetPassword}
        disabled={loading}
        sx={{ paddingY: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
      </Button>
      {message && (
        <Typography variant="body2" align="center" sx={{ marginTop: 2, color: message.includes('successfully') ? 'success.main' : 'error.main' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ResetPasswordPage;
