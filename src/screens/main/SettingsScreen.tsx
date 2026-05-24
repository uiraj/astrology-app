import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚙️</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.coming}>Settings coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  icon: { fontSize: 48 },
  title: {
    color: Colors.text,
    fontSize: Fonts.sizes.xl,
    fontWeight: '700',
    marginTop: 4,
  },
  coming: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    marginTop: 8,
  },
});
