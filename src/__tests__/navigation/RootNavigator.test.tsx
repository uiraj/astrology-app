import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useAuth } from '@/auth/useAuth';

// Mock entire navigators to isolate RootNavigator logic
jest.mock('@/navigation/AuthNavigator', () => {
  const { Text } = require('react-native');
  return () => <Text>AuthNavigator</Text>;
});

jest.mock('@/navigation/MainNavigator', () => {
  const { Text } = require('react-native');
  return () => <Text>MainNavigator</Text>;
});

jest.mock('@/screens/SplashScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>SplashScreen</Text>;
});

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

// Factory prevents Jest from parsing the real module and hitting Firebase ESM
jest.mock('@/auth/useAuth', () => ({ useAuth: jest.fn() }));

// Import after mocks are set up
import RootNavigator from '@/navigation/RootNavigator';

beforeEach(() => jest.clearAllMocks());

describe('RootNavigator', () => {
  it('renders SplashScreen while auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({ loading: true, isLoggedIn: false });

    render(<RootNavigator />);

    expect(screen.getByText('SplashScreen')).toBeTruthy();
    expect(screen.queryByText('AuthNavigator')).toBeNull();
    expect(screen.queryByText('MainNavigator')).toBeNull();
  });

  it('renders AuthNavigator when not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ loading: false, isLoggedIn: false });

    render(<RootNavigator />);

    expect(screen.getByText('AuthNavigator')).toBeTruthy();
    expect(screen.queryByText('MainNavigator')).toBeNull();
    expect(screen.queryByText('SplashScreen')).toBeNull();
  });

  it('renders MainNavigator when logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ loading: false, isLoggedIn: true });

    render(<RootNavigator />);

    expect(screen.getByText('MainNavigator')).toBeTruthy();
    expect(screen.queryByText('AuthNavigator')).toBeNull();
    expect(screen.queryByText('SplashScreen')).toBeNull();
  });
});
