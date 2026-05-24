import React, { useState, useRef } from 'react';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required';
  if (!email.includes('@') || !email.includes('.')) return 'Enter a valid email';
  return '';
}

function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  return '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginScreen({ navigation }: Props) {
  const { login, error: firebaseError, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Show field errors only after the user has touched (blurred) that field,
  // or after a failed submit attempt.
  const [touched, setTouched] = useState({ email: false, password: false });

  const passwordRef = useRef<TextInput>(null);

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  const isFormValid = !errors.email && !errors.password;

  const touch = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!isFormValid) return;
    await login(email.trim(), password);
    // On success: onAuthStateChanged in AuthContext flips isLoggedIn → true,
    // AppNavigator swaps AuthNavigator out for the main stack automatically.
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
        <Text style={styles.title}>✨ Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your cosmic journey</Text>

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
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            editable={!loading}
          />
          {touched.email && errors.email ? (
            <Text style={styles.fieldError}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              ref={passwordRef}
              style={[
                styles.input,
                styles.inputFlex,
                touched.password && errors.password ? styles.inputError : null,
              ]}
              value={password}
              onChangeText={setPassword}
              onBlur={() => touch('password')}
              placeholder="Your password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!loading}
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

        {/* Firebase error — placed here so it stays visible above the button when keyboard is open */}
        {firebaseError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{firebaseError}</Text>
          </View>
        ) : null}

        {/* Login button */}
        <TouchableOpacity
          testID="login-button"
          style={[
            styles.button,
            (!isFormValid || loading) && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!isFormValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        {/* Sign up link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Sign Up</Text>
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    fontWeight: '500',
  },
  forgotLink: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
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
