
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

const Index = () => {
  const { isAuthenticated } = useUserStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;