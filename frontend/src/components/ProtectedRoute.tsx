// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useSelector((s: RootState) => s.auth?.accessToken);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
