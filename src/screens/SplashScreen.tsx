import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-cosmic-bg">
      <Text className="text-[56px]">✨</Text>
      <Text className="text-cosmic-text text-[32px] font-bold tracking-widest mb-2">
        Celestial
      </Text>
      <ActivityIndicator size="large" color="#9b59b6" className="mt-6" />
    </View>
  );
}
