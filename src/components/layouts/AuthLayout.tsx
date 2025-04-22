import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Container, Paper, Box, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const AuthLayout: React.FC = () => {
  const { currentUser, loading } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (!loading && currentUser) {
    return <Navigate to="/" />;
  }
  
  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper 
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            SchoolBus
          </Typography>
          <Typography component="h2" variant="h6" color="text.secondary">
            School Management Platform
          </Typography>
        </Box>
        
        {/* Render the nested routes (Login or Register) */}
        <Outlet />
      </Paper>
    </Container>
  );
};

export default AuthLayout; 