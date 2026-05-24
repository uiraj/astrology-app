import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✨</Text>
      <Text style={styles.title}>Celestial</Text>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={styles.spinner}
      />
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
  logo: {
    fontSize: 56,
  },
  title: {
    color: Colors.text,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  spinner: {
    marginTop: 24,
  },
});
