import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/auth/useAuth';

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function HomeScreen() {
  const { user, logout, loading } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-cosmic-bg">
      <View className="flex-1 items-center px-6 pt-8 gap-3">

        {/* Header */}
        <Text className="text-cosmic-muted text-base tracking-wide">Welcome back,</Text>
        <Text className="text-cosmic-text text-xl font-bold mb-2" numberOfLines={1}>
          {user?.email}
        </Text>

        {/* Zodiac row */}
        <View className="flex-row flex-wrap justify-center gap-2 my-2">
          {ZODIAC_SIGNS.map((sign) => (
            <Text key={sign} className="text-cosmic-star text-2xl">{sign}</Text>
          ))}
        </View>

        {/* Card */}
        <View className="w-full rounded-2xl p-6 gap-2 bg-cosmic-surface border border-cosmic-primary/40">
          <Text className="text-cosmic-text text-xl font-semibold">Your Cosmic Journey</Text>
          <Text className="text-cosmic-muted text-base leading-relaxed">
            More features are on the way — birth charts, daily horoscopes,
            and celestial insights tailored to you.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className={`mt-auto mb-4 w-full rounded-[14px] py-[14px] items-center border border-cosmic-primary${loading ? ' opacity-50' : ''}`}
          onPress={logout}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#e8d5f5" />
          ) : (
            <Text className="text-cosmic-primary text-base font-semibold">Log Out</Text>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
