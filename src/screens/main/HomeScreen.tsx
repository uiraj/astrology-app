import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/auth/useAuth';
import { useBirthData } from '@/hooks/useBirthData';
import type { MainStackParamList } from '@/types/navigation';

type NavProp = NativeStackNavigationProp<MainStackParamList>;

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

function formatDisplayDate(iso: string): string {
  const [year, month, day] = iso.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HomeScreen() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigation = useNavigation<NavProp>();
  const { birthData, loading: birthLoading, refetch } = useBirthData();

  // Refetch whenever this screen comes into focus (e.g. returning from edit)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const hasBirthData = !!birthData;

  return (
    <SafeAreaView className="flex-1 bg-cosmic-bg">
      <ScrollView
        contentContainerClassName="items-center px-6 pt-8 pb-6 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Text className="text-cosmic-muted text-base tracking-wide">
          Welcome back,
        </Text>
        <Text
          className="text-cosmic-text text-xl font-bold mb-2"
          numberOfLines={1}
        >
          {user?.email}
        </Text>

        {/* ── Zodiac row ── */}
        <View className="flex-row flex-wrap justify-center gap-2 my-2">
          {ZODIAC_SIGNS.map((sign) => (
            <Text key={sign} className="text-cosmic-star text-2xl">
              {sign}
            </Text>
          ))}
        </View>

        {/* ── Birth chart section ── */}
        {birthLoading && !birthData ? (
          <View className="w-full rounded-2xl p-5 items-center bg-cosmic-surface border border-cosmic-primary/40">
            <ActivityIndicator color="#9b59b6" />
            <Text className="text-cosmic-muted text-sm mt-2">
              Loading your chart…
            </Text>
          </View>
        ) : hasBirthData ? (
          /* ── Existing data summary card ── */
          <View className="w-full rounded-2xl bg-cosmic-surface border border-cosmic-primary/40 overflow-hidden">
            {/* Card header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-xl">🌟</Text>
                <Text className="text-cosmic-text text-base font-bold">
                  Your Birth Data
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('BirthData', { isEdit: true })}
                className="bg-cosmic-primary/20 rounded-full px-3 py-1"
                activeOpacity={0.7}
              >
                <Text className="text-cosmic-primary text-xs font-semibold">
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="h-px bg-cosmic-primary/20 mx-5" />

            {/* Data rows */}
            <View className="px-5 py-3 gap-2.5">
              <View className="flex-row items-center gap-3">
                <Text className="text-base">📅</Text>
                <View className="flex-1">
                  <Text className="text-cosmic-muted text-xs mb-0.5">
                    Birth Date
                  </Text>
                  <Text className="text-cosmic-text text-sm font-medium">
                    {formatDisplayDate(birthData!.birthDate)}
                  </Text>
                </View>
              </View>

              {birthData!.birthTime && (
                <View className="flex-row items-center gap-3">
                  <Text className="text-base">🕐</Text>
                  <View className="flex-1">
                    <Text className="text-cosmic-muted text-xs mb-0.5">
                      Birth Time
                    </Text>
                    <Text className="text-cosmic-text text-sm font-medium">
                      {birthData!.birthTime}
                    </Text>
                  </View>
                </View>
              )}

              {birthData!.location && (
                <View className="flex-row items-center gap-3">
                  <Text className="text-base">📍</Text>
                  <View className="flex-1">
                    <Text className="text-cosmic-muted text-xs mb-0.5">
                      Birth Location
                    </Text>
                    <Text className="text-cosmic-text text-sm font-medium">
                      {birthData!.location}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* View chart button */}
            <TouchableOpacity
              className="mx-5 mb-4 rounded-xl py-3 items-center bg-cosmic-primary/15 border border-cosmic-primary/40"
              onPress={() =>
                navigation.navigate('HoroscopeResult', {
                  birthDate: birthData!.birthDate,
                  birthTime: birthData!.birthTime ?? undefined,
                  location: birthData!.location ?? undefined,
                  lat: birthData!.lat ?? undefined,
                  lon: birthData!.lon ?? undefined,
                })
              }
              activeOpacity={0.75}
            >
              <Text className="text-cosmic-primary text-sm font-semibold">
                View Chart →
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── No data CTA ── */
          <TouchableOpacity
            className="w-full rounded-2xl p-5 gap-1 bg-cosmic-primary/15 border border-cosmic-primary/50"
            onPress={() => navigation.navigate('BirthData')}
            activeOpacity={0.75}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🌟</Text>
              <Text className="text-cosmic-text text-base font-bold">
                Start Birth Chart
              </Text>
            </View>
            <Text className="text-cosmic-muted text-sm leading-relaxed ml-8">
              Enter your birth details to unlock your full cosmic profile
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Coming soon card ── */}
        <View className="w-full rounded-2xl p-5 gap-2 bg-cosmic-surface border border-cosmic-primary/40">
          <Text className="text-cosmic-text text-base font-semibold">
            Your Cosmic Journey
          </Text>
          <Text className="text-cosmic-muted text-sm leading-relaxed">
            More features are on the way — birth charts, daily horoscopes,
            and celestial insights tailored to you.
          </Text>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          className={`w-full rounded-[14px] py-[14px] items-center border border-cosmic-primary mt-2${
            authLoading ? ' opacity-50' : ''
          }`}
          onPress={logout}
          disabled={authLoading}
          activeOpacity={0.8}
        >
          {authLoading ? (
            <ActivityIndicator color="#e8d5f5" />
          ) : (
            <Text className="text-cosmic-primary text-base font-semibold">
              Log Out
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
