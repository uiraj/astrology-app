import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import { useAuth } from '@/auth/useAuth';
import { createMockNavigation, mockRoute } from '../../helpers/renderWithProviders';

// Factory prevents Jest from parsing the real module and hitting Firebase ESM
jest.mock('@/auth/useAuth', () => ({ useAuth: jest.fn() }));

const mockSignUp = jest.fn();

const defaultAuth = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  login: jest.fn(),
  logout: jest.fn(),
  signUp: mockSignUp,
  checkAuthStatus: jest.fn(),
};

function renderScreen(authOverrides = {}) {
  (useAuth as jest.Mock).mockReturnValue({ ...defaultAuth, ...authOverrides });
  const navigation = createMockNavigation();
  render(<SignUpScreen navigation={navigation as any} route={mockRoute as any} />);
  return { navigation };
}

beforeEach(() => jest.clearAllMocks());

describe('SignUpScreen — rendering', () => {
  it('renders title and all three inputs', () => {
    renderScreen();

    expect(screen.getByText('✨ Create Account')).toBeTruthy();
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Min 8 characters')).toBeTruthy();
    expect(screen.getByPlaceholderText('Re-enter password')).toBeTruthy();
  });

  it('renders Log In link', () => {
    renderScreen();
    expect(screen.getByText('Log In')).toBeTruthy();
  });
});

describe('SignUpScreen — validation', () => {
  it('shows email error on blur when empty', () => {
    renderScreen();

    fireEvent(screen.getByPlaceholderText('you@example.com'), 'blur');

    expect(screen.getByText('Email is required')).toBeTruthy();
  });

  it('shows email format error for input without @', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'bademail');
    fireEvent(screen.getByPlaceholderText('you@example.com'), 'blur');

    expect(screen.getByText('Enter a valid email')).toBeTruthy();
  });

  it('shows password length error on blur', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('Min 8 characters'), 'short');
    fireEvent(screen.getByPlaceholderText('Min 8 characters'), 'blur');

    expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('shows confirm password mismatch error', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('Min 8 characters'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Re-enter password'), 'different123');
    fireEvent(screen.getByPlaceholderText('Re-enter password'), 'blur');

    expect(screen.getByText('Passwords do not match')).toBeTruthy();
  });

  it('shows confirm required error on blur when empty', () => {
    renderScreen();

    fireEvent(screen.getByPlaceholderText('Re-enter password'), 'blur');

    expect(screen.getByText('Please confirm your password')).toBeTruthy();
  });

  it('shows no errors when all fields are valid', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    fireEvent(screen.getByPlaceholderText('you@example.com'), 'blur');

    fireEvent.changeText(screen.getByPlaceholderText('Min 8 characters'), 'password123');
    fireEvent(screen.getByPlaceholderText('Min 8 characters'), 'blur');

    fireEvent.changeText(screen.getByPlaceholderText('Re-enter password'), 'password123');
    fireEvent(screen.getByPlaceholderText('Re-enter password'), 'blur');

    expect(screen.queryByText('Email is required')).toBeNull();
    expect(screen.queryByText('Password must be at least 8 characters')).toBeNull();
    expect(screen.queryByText('Passwords do not match')).toBeNull();
  });
});

describe('SignUpScreen — interactions', () => {
  it('calls signUp() with email and password on submit', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'new@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Min 8 characters'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Re-enter password'), 'password123');
    fireEvent.press(screen.getByText('Create Account'));

    expect(mockSignUp).toHaveBeenCalledWith('new@example.com', 'password123');
  });

  it('does not call signUp() when passwords do not match', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Min 8 characters'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Re-enter password'), 'different999');
    fireEvent.press(screen.getByText('Create Account'));

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('navigates to Login when link is pressed', () => {
    const { navigation } = renderScreen();

    fireEvent.press(screen.getByText('Log In'));

    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});

describe('SignUpScreen — error display', () => {
  it('shows Firebase error above Create Account button', () => {
    renderScreen({ error: 'Email already registered' });

    expect(screen.getByText('Email already registered')).toBeTruthy();
  });

  it('does not render error banner when error is null', () => {
    renderScreen({ error: null });

    expect(screen.queryByText('Email already registered')).toBeNull();
  });
});
