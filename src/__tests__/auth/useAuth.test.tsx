import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useAuth } from '@/auth/useAuth';
import { AuthContext } from '@/auth/AuthContext';

// Prevent Jest from parsing Firebase's ESM source files
jest.mock('@/config/firebase', () => ({ auth: {}, db: {} }));
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
}));

const mockContextValue = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  login: jest.fn(),
  logout: jest.fn(),
  signUp: jest.fn(),
  checkAuthStatus: jest.fn(),
};

describe('useAuth', () => {
  it('returns context values when used inside AuthProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.isLoggedIn).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.signUp).toBe('function');
  });

  it('throws when used outside AuthProvider', () => {
    // Suppress the expected error output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used inside <AuthProvider>');
  });
});
