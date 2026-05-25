import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<MainStackParamList, 'HoroscopeResult'>;

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-cosmic-primary/20">
      <Text className="text-cosmic-muted text-sm">{label}</Text>
      <Text className="text-cosmic-text text-sm font-medium">{value}</Text>
    </View>
  );
}

function formatDisplayDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HoroscopeResultScreen({ route, navigation }: Props) {
  const { birthDate, birthTime, location } = route.params;

  return (
    <ScrollView
      className="flex-1 bg-cosmic-bg"
      contentContainerClassName="px-6 py-8"
    >
      {/* Header */}
      <View className="items-center mb-8">
        <Text className="text-[56px] mb-3">🔮</Text>
        <Text className="text-cosmic-text text-2xl font-bold text-center">
          Birth Chart Ready
        </Text>
        <Text className="text-cosmic-muted text-sm text-center mt-2">
          Your cosmic details have been recorded
        </Text>
      </View>

      {/* Data summary card */}
      <View className="bg-cosmic-surface rounded-2xl border border-cosmic-primary/40 px-5 py-2 mb-6">
        <DataRow label="Birth Date" value={formatDisplayDate(birthDate)} />
        {birthTime ? (
          <DataRow label="Birth Time" value={birthTime} />
        ) : null}
        {location ? (
          <DataRow label="Location" value={location} />
        ) : null}
      </View>

      {/* Coming soon card */}
      <View className="bg-cosmic-primary/10 rounded-2xl border border-cosmic-primary/30 p-5 mb-8 gap-3">
        <Text className="text-cosmic-primary text-base font-semibold">
          ✨ Coming Next
        </Text>
        <View className="gap-2">
          {[
            '🌞  Sun sign & rising sign',
            '🌙  Moon sign & lunar phase',
            '⭐  Planetary positions',
            '📊  Full natal chart wheel',
            '📅  Daily horoscope',
          ].map((item) => (
            <Text key={item} className="text-cosmic-muted text-sm leading-relaxed">
              {item}
            </Text>
          ))}
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity
        className="rounded-[14px] py-4 items-center bg-cosmic-primary mb-3"
        onPress={() => navigation.navigate('Tabs')}
        activeOpacity={0.8}
      >
        <Text className="text-cosmic-text text-base font-bold tracking-wide">
          Back to Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="rounded-[14px] py-4 items-center border border-cosmic-primary/60"
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text className="text-cosmic-primary text-base font-medium">
          Edit Birth Details
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
