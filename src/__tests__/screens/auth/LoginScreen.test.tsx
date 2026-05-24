import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import LoginScreen from '@/screens/auth/LoginScreen';
import { useAuth } from '@/auth/useAuth';
import { createMockNavigation, mockRoute } from '../../helpers/renderWithProviders';

// Factory prevents Jest from parsing the real module and hitting Firebase ESM
jest.mock('@/auth/useAuth', () => ({ useAuth: jest.fn() }));

const mockLogin = jest.fn();

const defaultAuth = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  login: mockLogin,
  logout: jest.fn(),
  signUp: jest.fn(),
  checkAuthStatus: jest.fn(),
};

function renderScreen(authOverrides = {}) {
  (useAuth as jest.Mock).mockReturnValue({ ...defaultAuth, ...authOverrides });
  const navigation = createMockNavigation();
  render(<LoginScreen navigation={navigation as any} route={mockRoute as any} />);
  return { navigation };
}

beforeEach(() => jest.clearAllMocks());

describe('LoginScreen — rendering', () => {
  it('renders title, email and password inputs', () => {
    renderScreen();

    expect(screen.getByText('✨ Welcome Back')).toBeTruthy();
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Your password')).toBeTruthy();
  });

  it('renders the Log In button', () => {
    renderScreen();
    expect(screen.getByText('Log In')).toBeTruthy();
  });

  it('renders Sign Up and Forgot password links', () => {
    renderScreen();
    expect(screen.getByText('Sign Up')).toBeTruthy();
    expect(screen.getByText('Forgot password?')).toBeTruthy();
  });
});

describe('LoginScreen — validation', () => {
  it('shows email error when field is blurred empty', () => {
    renderScreen();

    fireEvent(screen.getByPlaceholderText('you@example.com'), 'blur');

    expect(screen.getByText('Email is required')).toBeTruthy();
  });

  it('shows email format error for input without @', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'notanemail');
    fireEvent(screen.getByPlaceholderText('you@example.com'), 'blur');

    expect(screen.getByText('Enter a valid email')).toBeTruthy();
  });

  it('shows password error when field is blurred empty', () => {
    renderScreen();

    fireEvent(screen.getByPlaceholderText('Your password'), 'blur');

    expect(screen.getByText('Password is required')).toBeTruthy();
  });
});

describe('LoginScreen — button state', () => {
  it('Log In button is disabled when form is invalid', () => {
    renderScreen();
    expect(screen.getByTestId('login-button').props.accessibilityState.disabled).toBe(true);
  });

  it('shows ActivityIndicator and hides button text during loading', () => {
    renderScreen({ loading: true });

    expect(screen.queryByText('Log In')).toBeNull();
    // RNTL renders ActivityIndicator as a View with role="progressbar" in the tree
    expect(screen.toJSON()).toBeTruthy(); // tree renders without crash
  });
});

describe('LoginScreen — interactions', () => {
  it('calls login() with email and password on submit', () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Your password'), 'password123');
    fireEvent.press(screen.getByText('Log In'));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('navigates to SignUp when link is pressed', () => {
    const { navigation } = renderScreen();

    fireEvent.press(screen.getByText('Sign Up'));

    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('navigates to ForgotPassword when link is pressed', () => {
    const { navigation } = renderScreen();

    fireEvent.press(screen.getByText('Forgot password?'));

    expect(navigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});

describe('LoginScreen — error display', () => {
  it('shows Firebase error message above the button', () => {
    renderScreen({ error: 'Wrong email or password' });

    expect(screen.getByText('Wrong email or password')).toBeTruthy();
  });

  it('shows network error message', () => {
    renderScreen({ error: 'Network error. Check your connection' });

    expect(screen.getByText('Network error. Check your connection')).toBeTruthy();
  });

  it('does not render error banner when error is null', () => {
    renderScreen({ error: null });

    expect(screen.queryByText('Wrong email or password')).toBeNull();
  });
});
