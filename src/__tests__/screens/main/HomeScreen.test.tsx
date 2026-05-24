import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HomeScreen from '@/screens/main/HomeScreen';
import { useAuth } from '@/auth/useAuth';

// Factory prevents Jest from parsing the real module and hitting Firebase ESM
jest.mock('@/auth/useAuth', () => ({ useAuth: jest.fn() }));

const mockLogout = jest.fn();

function renderScreen(authOverrides = {}) {
  (useAuth as jest.Mock).mockReturnValue({
    user: { uid: 'uid-1', email: 'cosmic@example.com' },
    loading: false,
    error: null,
    isLoggedIn: true,
    login: jest.fn(),
    logout: mockLogout,
    signUp: jest.fn(),
    checkAuthStatus: jest.fn(),
    ...authOverrides,
  });
  return render(<HomeScreen />);
}

beforeEach(() => jest.clearAllMocks());

describe('HomeScreen (main)', () => {
  it('renders the user email', () => {
    renderScreen();
    expect(screen.getByText('cosmic@example.com')).toBeTruthy();
  });

  it('renders the welcome text', () => {
    renderScreen();
    expect(screen.getByText('Welcome back,')).toBeTruthy();
  });

  it('calls logout when Log Out button is pressed', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Log Out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('disables Log Out button while loading', () => {
    renderScreen({ loading: true });
    // Button is disabled — Log Out text is replaced by spinner
    expect(screen.queryByText('Log Out')).toBeNull();
  });

  it('renders all 12 zodiac signs', () => {
    renderScreen();
    const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    signs.forEach((sign) => {
      expect(screen.getByText(sign)).toBeTruthy();
    });
  });
});
