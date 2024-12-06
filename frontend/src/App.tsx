import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VerifyEmailPage from './pages/VerifyEmailPage';
import RequestResetPasswordPage from './pages/RequestResetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { CssBaseline, Box } from '@mui/material';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import CalendarPage from './pages/CalendarPage';
import EventCreationPage from './pages/EventCreationPage';
import EventFeedPage from './pages/EventFeedPage';
import FriendsAndProfilePage from './pages/FriendsAndProfilePage';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user && <Navbar />}
        <Box sx={{ display: 'flex' }}>
          {user && <Sidebar />}
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<RedirectOnAuth><LoginPage /></RedirectOnAuth>} />
                <Route path="/register" element={<RedirectOnAuth><RegisterPage /></RedirectOnAuth>} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/request-reset-password" element={<RequestResetPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>
              <Route
                path="/events-feed"
                element={
                  <ProtectedRoute>
                    <EventFeedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute>
                    <EventCreationPage />
                  </ProtectedRoute>
                }
              />
             <Route
              path="/friends-profile"
              element={
                <ProtectedRoute>
                  <FriendsAndProfilePage />
                </ProtectedRoute>
              }
          />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

const RedirectOnAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default App;
