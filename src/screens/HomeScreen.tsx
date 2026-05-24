import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { Colors, Fonts } from '@/constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function HomeScreen(_props: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.content}>
        <Text style={styles.subtitle}>Welcome to</Text>
        <Text style={styles.title}>✨ Celestial</Text>

        <View style={styles.zodiacRow}>
          {ZODIAC_SIGNS.map((sign) => (
            <Text key={sign} style={styles.zodiacGlyph}>
              {sign}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Cosmic Journey Begins</Text>
          <Text style={styles.cardBody}>
            Discover your birth chart, daily horoscope, and the celestial
            influences shaping your path.
          </Text>
        </View>

        <Text style={styles.hint}>
          App is running! 🚀{'\n'}Start building in src/screens/HomeScreen.tsx
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.text,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '700',
    letterSpacing: 1,
  },
  zodiacRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  zodiacGlyph: {
    fontSize: Fonts.sizes.xl,
    color: Colors.star,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    gap: 8,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
  },
  cardBody: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
    lineHeight: 22,
  },
  hint: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});
