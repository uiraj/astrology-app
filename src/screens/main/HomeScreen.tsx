import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/auth/useAuth';
import { Colors, Fonts } from '@/constants/theme';

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function HomeScreen() {
  const { user, logout, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>

        {/* Zodiac row */}
        <View style={styles.zodiacRow}>
          {ZODIAC_SIGNS.map((sign) => (
            <Text key={sign} style={styles.zodiacGlyph}>{sign}</Text>
          ))}
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Cosmic Journey</Text>
          <Text style={styles.cardBody}>
            More features are on the way — birth charts, daily horoscopes,
            and celestial insights tailored to you.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, loading && styles.logoutDisabled]}
          onPress={logout}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.logoutText}>Log Out</Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
    alignItems: 'center',
  },
  greeting: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
    letterSpacing: 0.5,
  },
  email: {
    color: Colors.text,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    marginBottom: 8,
    maxWidth: '100%',
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
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 16,
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  logoutDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    color: Colors.primary,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
});
