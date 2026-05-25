import React, { useState, useRef } from 'react';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required';
  if (!email.includes('@') || !email.includes('.')) return 'Enter a valid email';
  return '';
}

function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  return '';
}

export default function LoginScreen({ navigation }: Props) {
  const { login, error: firebaseError, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          ✨ Welcome Back
        </Text>
        <Text className="text-cosmic-muted text-base text-center mb-8 tracking-wide">
          Sign in to your cosmic journey
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
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            editable={!loading}
          />
          {touched.email && errors.email ? (
            <Text className="text-cosmic-field-error text-xs mt-1 ml-1">{errors.email}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-cosmic-muted text-sm font-medium">Password</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text className="text-cosmic-primary text-sm font-medium">Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <TextInput
              ref={passwordRef}
              className={`flex-1 bg-cosmic-surface rounded-xl border px-4 py-[14px] text-cosmic-text text-base ${touched.password && errors.password ? 'border-cosmic-error-border' : 'border-cosmic-primary/40'}`}
              value={password}
              onChangeText={setPassword}
              onBlur={() => touch('password')}
              placeholder="Your password"
              placeholderTextColor="#8e6aaa"
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!loading}
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

        {/* Firebase error */}
        {firebaseError ? (
          <View className="bg-cosmic-error-bg rounded-[10px] p-3 mb-4 border border-cosmic-error-border">
            <Text className="text-cosmic-error-text text-sm text-center">{firebaseError}</Text>
          </View>
        ) : null}

        {/* Login button */}
        <TouchableOpacity
          testID="login-button"
          className={`rounded-[14px] py-4 items-center mt-2 mb-2 bg-cosmic-primary${!isFormValid || loading ? ' opacity-45' : ''}`}
          onPress={handleLogin}
          disabled={!isFormValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#e8d5f5" />
          ) : (
            <Text className="text-cosmic-text text-base font-bold tracking-wide">Log In</Text>
          )}
        </TouchableOpacity>

        {/* Sign up link */}
        <View className="flex-row justify-center mt-5">
          <Text className="text-cosmic-muted text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-cosmic-primary text-sm font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
