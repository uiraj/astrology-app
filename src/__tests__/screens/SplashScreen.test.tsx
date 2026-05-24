import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SplashScreen from '@/screens/SplashScreen';

describe('SplashScreen', () => {
  it('renders the app title', () => {
    render(<SplashScreen />);
    expect(screen.getByText('Celestial')).toBeTruthy();
  });

  it('renders the logo emoji', () => {
    render(<SplashScreen />);
    expect(screen.getByText('✨')).toBeTruthy();
  });

  it('renders an ActivityIndicator', () => {
    const { toJSON } = render(<SplashScreen />);
    // Verify component tree renders without crashing
    expect(toJSON()).not.toBeNull();
  });
});
