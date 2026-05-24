import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation';
import { useAuth } from '@/auth/useAuth';
import { Colors, Fonts } from '@/constants/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

// ─── Field-level validation ───────────────────────────────────────────────────

function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required';
  if (!email.includes('@') || !email.includes('.')) return 'Enter a valid email';
  return '';
}

function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
}

function validateConfirm(password: string, confirm: string): string {
  if (!confirm) return 'Please confirm your password';
  if (confirm !== password) return 'Passwords do not match';
  return '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignUpScreen({ navigation }: Props) {
  const { signUp, error: firebaseError, loading, isLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Track which fields the user has interacted with so errors only
  // appear after a field is touched, not on first render.
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
  });

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    confirm: validateConfirm(password, confirm),
  };

  const isFormValid =
    !errors.email && !errors.password && !errors.confirm;

  // Auto-navigate to home once Firebase confirms the user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      // AuthNavigator will unmount automatically when isLoggedIn flips,
      // so no explicit navigate() call is needed here. But if you ever
      // embed auth inside a tab navigator, call navigation.replace instead.
    }
  }, [isLoggedIn]);

  const touch = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSignUp = async () => {
    // Mark all fields touched so all errors show on submit
    setTouched({ email: true, password: true, confirm: true });
    if (!isFormValid) return;
    await signUp(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={styles.title}>✨ Create Account</Text>
        <Text style={styles.subtitle}>Start your cosmic journey</Text>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              touched.email && errors.email ? styles.inputError : null,
            ]}
            value={email}
            onChangeText={setEmail}
            onBlur={() => touch('email')}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {touched.email && errors.email ? (
            <Text style={styles.fieldError}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                styles.inputFlex,
                touched.password && errors.password ? styles.inputError : null,
              ]}
              value={password}
              onChangeText={setPassword}
              onBlur={() => touch('password')}
              placeholder="Min 8 characters"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {touched.password && errors.password ? (
            <Text style={styles.fieldError}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Confirm Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                styles.inputFlex,
                touched.confirm && errors.confirm ? styles.inputError : null,
              ]}
              value={confirm}
              onChangeText={setConfirm}
              onBlur={() => touch('confirm')}
              placeholder="Re-enter password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showConfirm}
              autoComplete="new-password"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirm((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {touched.confirm && errors.confirm ? (
            <Text style={styles.fieldError}>{errors.confirm}</Text>
          ) : null}
        </View>

        {/* Firebase error — placed here so it stays visible above the button when keyboard is open */}
        {firebaseError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{firebaseError}</Text>
          </View>
        ) : null}

        {/* Sign Up button */}
        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || loading) && styles.buttonDisabled,
          ]}
          onPress={handleSignUp}
          disabled={!isFormValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 4,
  },
  title: {
    color: Colors.text,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  errorBanner: {
    backgroundColor: '#4a0000',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorBannerText: {
    color: '#ff8080',
    fontSize: Fonts.sizes.sm,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    color: Colors.text,
    fontSize: Fonts.sizes.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputFlex: {
    flex: 1,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  fieldError: {
    color: '#ff6b6b',
    fontSize: Fonts.sizes.xs,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: Colors.text,
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
  },
});
