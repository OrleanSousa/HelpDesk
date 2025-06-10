import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth.isAuthenticated && auth.user?.tipo === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute; 