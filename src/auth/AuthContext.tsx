import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/config/firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTH_TOKEN_KEY = '@auth_token';

// ─── Error mapping ────────────────────────────────────────────────────────────

function getFirebaseErrorMessage(error: unknown): string {
  // Use duck-typing on .code rather than instanceof — avoids false negatives
  // when Metro bundles multiple copies of the firebase module.
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email already registered';
    case 'auth/invalid-email':
      return 'Invalid email format';
    case 'auth/weak-password':
      return 'Password too weak (min 8 chars)';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
    case 'auth/invalid-credential': // Firebase 11 uses this for wrong password
      return 'Wrong email or password';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    default:
      return 'Something went wrong. Please try again';
  }
}

// ─── Input validation ─────────────────────────────────────────────────────────

function validateInputs(email: string, password: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ── Persist token so the user stays logged in between sessions ──
  const saveToken = async (token: string) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  };

  const clearToken = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  };

  // ── Check AsyncStorage on startup for a cached session ────────────
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      // Firebase's onAuthStateChanged is the source of truth;
      // the token here just prevents a loading flash on cold start.
      if (!token) {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  // ── Listen for Firebase auth state changes ────────────────────────
  useEffect(() => {
    checkAuthStatus();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await saveToken(token);

        setUser({ uid: firebaseUser.uid, email: firebaseUser.email ?? '' });
        setIsLoggedIn(true);
      } else {
        await clearToken();
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    // Clean up the listener when provider unmounts
    return unsubscribe;
  }, [checkAuthStatus]);

  // ── Sign up ───────────────────────────────────────────────────────
  const signUp = async (email: string, password: string) => {
    setError(null);

    const validationError = validateInputs(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged handles state updates after successful signup
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Login ─────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setError(null);

    const validationError = validateInputs(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged handles state updates after successful login
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────
  const logout = async () => {
    setError(null);
    try {
      setLoading(true);
      await signOut(auth);
      await clearToken();
      setUser(null);
      setIsLoggedIn(false);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isLoggedIn,
    signUp,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
