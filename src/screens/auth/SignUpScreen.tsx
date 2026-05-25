import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation';
import { useAuth } from '@/auth/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

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

export default function SignUpScreen({ navigation }: Props) {
  const { signUp, error: firebaseError, loading, isLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false });

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    confirm: validateConfirm(password, confirm),
  };

  const isFormValid = !errors.email && !errors.password && !errors.confirm;

  useEffect(() => {
    if (isLoggedIn) {
      // RootNavigator swaps AuthNavigator out automatically when isLoggedIn flips
    }
  }, [isLoggedIn]);

  const touch = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSignUp = async () => {
    setTouched({ email: true, password: true, confirm: true });
    if (!isFormValid) return;
    await signUp(email, password);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-cosmic-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="grow justify-center px-6 py-12 gap-1"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text className="text-cosmic-text text-[32px] font-bold text-center mb-1">
          ✨ Create Account
        </Text>
        <Text className="text-cosmic-muted text-base text-center mb-8 tracking-wide">
          Start your cosmic journey
        </Text>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-cosmic-muted text-sm font-medium mb-1.5">Email</Text>
          <TextInput
            className={`bg-cosmic-surface rounded-xl border px-4 py-[14px] text-cosmic-text text-base ${touched.email && errors.email ? 'border-cosmic-error-border' : 'border-cosmic-primary/40'}`}
            value={email}
            onChangeText={setEmail}
            onBlur={() => touch('email')}
            placeholder="you@example.com"
            placeholderTextColor="#8e6aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {touched.email && errors.email ? (
            <Text className="text-cosmic-field-error text-xs mt-1 ml-1">{errors.email}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-cosmic-muted text-sm font-medium mb-1.5">Password</Text>
          <View className="flex-row items-center">
            <TextInput
              className={`flex-1 bg-cosmic-surface rounded-xl border px-4 py-[14px] text-cosmic-text text-base ${touched.password && errors.password ? 'border-cosmic-error-border' : 'border-cosmic-primary/40'}`}
              value={password}
              onChangeText={setPassword}
              onBlur={() => touch('password')}
              placeholder="Min 8 characters"
              placeholderTextColor="#8e6aaa"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            <TouchableOpacity
              className="absolute right-3.5"
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-lg">{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {touched.password && errors.password ? (
            <Text className="text-cosmic-field-error text-xs mt-1 ml-1">{errors.password}</Text>
          ) : null}
        </View>

        {/* Confirm Password */}
        <View className="mb-4">
          <Text className="text-cosmic-muted text-sm font-medium mb-1.5">Confirm Password</Text>
          <View className="flex-row items-center">
            <TextInput
              className={`flex-1 bg-cosmic-surface rounded-xl border px-4 py-[14px] text-cosmic-text text-base ${touched.confirm && errors.confirm ? 'border-cosmic-error-border' : 'border-cosmic-primary/40'}`}
              value={confirm}
              onChangeText={setConfirm}
              onBlur={() => touch('confirm')}
              placeholder="Re-enter password"
              placeholderTextColor="#8e6aaa"
              secureTextEntry={!showConfirm}
              autoComplete="new-password"
            />
            <TouchableOpacity
              className="absolute right-3.5"
              onPress={() => setShowConfirm((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-lg">{showConfirm ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {touched.confirm && errors.confirm ? (
            <Text className="text-cosmic-field-error text-xs mt-1 ml-1">{errors.confirm}</Text>
          ) : null}
        </View>

        {/* Firebase error */}
        {firebaseError ? (
          <View className="bg-cosmic-error-bg rounded-[10px] p-3 mb-4 border border-cosmic-error-border">
            <Text className="text-cosmic-error-text text-sm text-center">{firebaseError}</Text>
          </View>
        ) : null}

        {/* Sign Up button */}
        <TouchableOpacity
          className={`rounded-[14px] py-4 items-center mt-2 mb-2 bg-cosmic-primary${!isFormValid || loading ? ' opacity-45' : ''}`}
          onPress={handleSignUp}
          disabled={!isFormValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#e8d5f5" />
          ) : (
            <Text className="text-cosmic-text text-base font-bold tracking-wide">Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login link */}
        <View className="flex-row justify-center mt-5">
          <Text className="text-cosmic-muted text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-cosmic-primary text-sm font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
