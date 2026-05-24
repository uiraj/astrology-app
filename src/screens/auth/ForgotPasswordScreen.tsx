import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation';
import { Colors, Fonts } from '@/constants/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Forgot Password</Text>
      <Text style={styles.body}>Password reset coming soon.</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  title: {
    color: Colors.text,
    fontSize: Fonts.sizes.xl,
    fontWeight: '700',
  },
  body: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
  },
  link: {
    color: Colors.primary,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    marginTop: 8,
  },
});
