import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/auth/useAuth';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 items-center justify-center gap-2 bg-cosmic-bg">
      <Text className="text-[48px]">👤</Text>
      <Text className="text-cosmic-text text-xl font-bold mt-1">Profile</Text>
      <Text className="text-cosmic-primary text-sm">{user?.email}</Text>
      <Text className="text-cosmic-muted text-sm mt-2">Full profile coming soon</Text>
    </View>
  );
}
