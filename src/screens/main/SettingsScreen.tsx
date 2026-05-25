import React from 'react';
import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-cosmic-bg">
      <Text className="text-[48px]">⚙️</Text>
      <Text className="text-cosmic-text text-xl font-bold mt-1">Settings</Text>
      <Text className="text-cosmic-muted text-sm mt-2">Settings coming soon</Text>
    </View>
  );
}
