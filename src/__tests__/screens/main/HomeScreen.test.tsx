import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HomeScreen from '@/screens/main/HomeScreen';
import { useAuth } from '@/auth/useAuth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBirthData } from '@/hooks/useBirthData';

jest.mock('@/auth/useAuth', () => ({ useAuth: jest.fn() }));
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  // useFocusEffect calls its callback immediately in tests
  useFocusEffect: (cb: () => void) => cb(),
}));
jest.mock('@/hooks/useBirthData', () => ({ useBirthData: jest.fn() }));

const mockLogout = jest.fn();
const mockNavigate = jest.fn();
const mockRefetch = jest.fn();

const defaultBirthData = {
  birthData: null,
  loading: false,
  saving: false,
  error: null,
  saveBirthData: jest.fn(),
  updateBirthData: jest.fn(),
  deleteBirthData: jest.fn(),
  refetch: mockRefetch,
};

function renderScreen(
  authOverrides = {},
  birthDataOverrides: Record<string, unknown> = {},
) {
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
  (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  (useBirthData as jest.Mock).mockReturnValue({
    ...defaultBirthData,
    ...birthDataOverrides,
  });
  return render(<HomeScreen />);
}

beforeEach(() => jest.clearAllMocks());

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('HomeScreen — rendering', () => {
  it('renders the user email', () => {
    renderScreen();
    expect(screen.getByText('cosmic@example.com')).toBeTruthy();
  });

  it('renders the welcome text', () => {
    renderScreen();
    expect(screen.getByText('Welcome back,')).toBeTruthy();
  });

  it('renders all 12 zodiac signs', () => {
    renderScreen();
    ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].forEach(
      (sign) => expect(screen.getByText(sign)).toBeTruthy(),
    );
  });
});

// ─── No birth data state ──────────────────────────────────────────────────────

describe('HomeScreen — no birth data', () => {
  it('shows Start Birth Chart CTA when no data exists', () => {
    renderScreen();
    expect(screen.getByText('Start Birth Chart')).toBeTruthy();
  });

  it('navigates to BirthData (new) when CTA is pressed', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Start Birth Chart'));
    expect(mockNavigate).toHaveBeenCalledWith('BirthData');
  });
});

// ─── Birth data loaded ────────────────────────────────────────────────────────

describe('HomeScreen — birth data exists', () => {
  const existingData = {
    birthDate: '1990-01-15T00:00:00.000Z',
    birthTime: '14:30',
    location: 'Mumbai, India',
    lat: 19.076,
    lon: 72.8777,
  };

  it('shows birth data summary card', () => {
    renderScreen({}, { birthData: existingData });
    expect(screen.getByText('Your Birth Data')).toBeTruthy();
    expect(screen.getByText('January 15, 1990')).toBeTruthy();
    expect(screen.getByText('14:30')).toBeTruthy();
    expect(screen.getByText('Mumbai, India')).toBeTruthy();
  });

  it('shows Edit button when birth data exists', () => {
    renderScreen({}, { birthData: existingData });
    expect(screen.getByText('Edit')).toBeTruthy();
  });

  it('navigates to BirthData in edit mode when Edit is pressed', () => {
    renderScreen({}, { birthData: existingData });
    fireEvent.press(screen.getByText('Edit'));
    expect(mockNavigate).toHaveBeenCalledWith('BirthData', { isEdit: true });
  });

  it('navigates to HoroscopeResult when View Chart is pressed', () => {
    renderScreen({}, { birthData: existingData });
    fireEvent.press(screen.getByText('View Chart →'));
    expect(mockNavigate).toHaveBeenCalledWith('HoroscopeResult', {
      birthDate: existingData.birthDate,
      birthTime: existingData.birthTime,
      location: existingData.location,
      lat: existingData.lat,
      lon: existingData.lon,
    });
  });

  it('does not show Start Birth Chart CTA when data exists', () => {
    renderScreen({}, { birthData: existingData });
    expect(screen.queryByText('Start Birth Chart')).toBeNull();
  });
});

// ─── Loading state ────────────────────────────────────────────────────────────

describe('HomeScreen — loading states', () => {
  it('shows loading spinner while birth data is being fetched', () => {
    renderScreen({}, { loading: true });
    expect(screen.getByText('Loading your chart…')).toBeTruthy();
  });

  it('hides Log Out text and shows spinner while auth is loading', () => {
    renderScreen({ loading: true });
    expect(screen.queryByText('Log Out')).toBeNull();
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

describe('HomeScreen — logout', () => {
  it('calls logout when Log Out button is pressed', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Log Out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

// ─── Focus refetch ────────────────────────────────────────────────────────────

describe('HomeScreen — focus refetch', () => {
  it('calls refetch when screen gains focus', () => {
    renderScreen();
    // useFocusEffect mock calls callback immediately on render
    expect(mockRefetch).toHaveBeenCalled();
  });
});
