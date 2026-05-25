import React from 'react';
import { AuthProvider } from '@/auth/AuthContext';
import RootNavigator from '@/navigation/RootNavigator';
import './src/config/firebase';
import './global.css';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
