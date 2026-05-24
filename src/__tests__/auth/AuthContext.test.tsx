import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider } from '@/auth/AuthContext';
import { useAuth } from '@/auth/useAuth';

// ─── Firebase mocks ───────────────────────────────────────────────────────────

jest.mock('@/config/firebase', () => ({ auth: {}, db: {} }));

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();

// Capture the onAuthStateChanged callback so tests can trigger auth changes
let authStateCallback: ((user: unknown) => void) | null = null;

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) => mockSignUp(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  onAuthStateChanged: (_auth: unknown, cb: (user: unknown) => void) => {
    authStateCallback = cb;
    return jest.fn(); // unsubscribe
  },
}));

// ─── Helper ───────────────────────────────────────────────────────────────────

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockFirebaseUser = {
  uid: 'uid-123',
  email: 'user@example.com',
  getIdToken: jest.fn().mockResolvedValue('mock-token'),
};

// Simulate Firebase reporting a logged-in user
async function simulateLogin() {
  await act(async () => {
    await authStateCallback?.(mockFirebaseUser);
  });
}

// Simulate Firebase reporting no user
async function simulateLogout() {
  await act(async () => {
    await authStateCallback?.(null);
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  authStateCallback = null;
});

describe('AuthContext — initial state', () => {
  it('starts loading with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('resolves to logged-out state when Firebase returns no user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    expect(result.current.loading).toBe(false);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('resolves to logged-in state when Firebase returns a user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogin();

    expect(result.current.loading).toBe(false);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual({
      uid: 'uid-123',
      email: 'user@example.com',
    });
  });
});

describe('AuthContext — login()', () => {
  it('sets error and skips Firebase when email is empty', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('', 'password123'); });

    expect(result.current.error).toBe('Email is required');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('sets error and skips Firebase when password is missing', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('test@example.com', ''); });

    expect(result.current.error).toBe('Password is required');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('sets error when password is shorter than 8 characters', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('test@example.com', 'short'); });

    expect(result.current.error).toBe('Password must be at least 8 characters');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signInWithEmailAndPassword with trimmed email', async () => {
    mockSignIn.mockResolvedValueOnce({});
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('  test@example.com  ', 'password123'); });

    expect(mockSignIn).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
  });

  it('maps auth/invalid-credential to friendly message', async () => {
    mockSignIn.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('test@example.com', 'wrongpass'); });

    expect(result.current.error).toBe('Wrong email or password');
  });

  it('maps auth/network-request-failed to friendly message', async () => {
    mockSignIn.mockRejectedValueOnce({ code: 'auth/network-request-failed' });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('test@example.com', 'password123'); });

    expect(result.current.error).toBe('Network error. Check your connection');
  });

  it('maps auth/too-many-requests to friendly message', async () => {
    mockSignIn.mockRejectedValueOnce({ code: 'auth/too-many-requests' });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('test@example.com', 'password123'); });

    expect(result.current.error).toBe('Too many attempts. Try again later');
  });

  it('uses fallback message for unknown error codes', async () => {
    mockSignIn.mockRejectedValueOnce({ code: 'auth/unknown-error' });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.login('test@example.com', 'password123'); });

    expect(result.current.error).toBe('Something went wrong. Please try again');
  });

  it('clears previous error on a new login attempt', async () => {
    mockSignIn.mockResolvedValueOnce({});
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    // First call sets an error
    await act(async () => { await result.current.login('', 'password123'); });
    expect(result.current.error).toBe('Email is required');

    // Second call should clear it
    await act(async () => { await result.current.login('test@example.com', 'password123'); });
    expect(result.current.error).toBeNull();
  });
});

describe('AuthContext — signUp()', () => {
  it('sets error and skips Firebase when email is empty', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.signUp('', 'password123'); });

    expect(result.current.error).toBe('Email is required');
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('calls createUserWithEmailAndPassword with valid inputs', async () => {
    mockSignUp.mockResolvedValueOnce({});
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.signUp('new@example.com', 'password123'); });

    expect(mockSignUp).toHaveBeenCalledWith({}, 'new@example.com', 'password123');
  });

  it('maps auth/email-already-in-use to friendly message', async () => {
    mockSignUp.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.signUp('taken@example.com', 'password123'); });

    expect(result.current.error).toBe('Email already registered');
  });

  it('maps auth/weak-password to friendly message', async () => {
    mockSignUp.mockRejectedValueOnce({ code: 'auth/weak-password' });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogout();

    await act(async () => { await result.current.signUp('test@example.com', 'password123'); });

    expect(result.current.error).toBe('Password too weak (min 8 chars)');
  });
});

describe('AuthContext — logout()', () => {
  it('calls signOut and clears user state', async () => {
    mockSignOut.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogin();

    expect(result.current.isLoggedIn).toBe(true);

    await act(async () => { await result.current.logout(); });
    // Simulate Firebase confirming logout
    await simulateLogout();

    expect(mockSignOut).toHaveBeenCalled();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('sets error message if signOut fails', async () => {
    mockSignOut.mockRejectedValueOnce({ code: 'auth/network-request-failed' });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await simulateLogin();

    await act(async () => { await result.current.logout(); });

    expect(result.current.error).toBe('Network error. Check your connection');
  });
});
