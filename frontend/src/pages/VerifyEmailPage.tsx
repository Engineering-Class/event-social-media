// src/pages/VerifyEmailPage.tsx
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import { Typography, Box, CircularProgress } from '@mui/material';

const VerifyEmailPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string>('Verifying...');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      verifyEmail(token);
    } else {
      setMessage('Invalid verification link.');
      setLoading(false);
    }
  }, [location.search]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
      const { token: authToken, user } = response.data;
      login(authToken, user);
      setMessage('Email verified successfully!');
      setLoading(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Email Verification Error:', error);
      setMessage(error.response?.data?.message || 'Email verification failed.');
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
      {loading ? (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            {message}
          </Typography>
        </>
      ) : (
        <Typography variant="h6">{message}</Typography>
      )}
    </Box>
  );
};

export default VerifyEmailPage;
