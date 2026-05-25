import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6 bg-cosmic-bg">
      <Text className="text-[48px]">🔑</Text>
      <Text className="text-cosmic-text text-xl font-bold">Forgot Password</Text>
      <Text className="text-cosmic-muted text-base text-center">
        Password reset coming soon.
      </Text>
      <TouchableOpacity className="mt-2" onPress={() => navigation.goBack()}>
        <Text className="text-cosmic-primary text-base font-semibold">← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
