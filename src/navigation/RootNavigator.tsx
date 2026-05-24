import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/auth/useAuth';
import SplashScreen from '@/screens/SplashScreen';
import AuthNavigator from '@/navigation/AuthNavigator';
import MainNavigator from '@/navigation/MainNavigator';

export default function RootNavigator() {
  const { isLoggedIn, loading } = useAuth();

  // Firebase is still resolving the initial session — show splash
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
