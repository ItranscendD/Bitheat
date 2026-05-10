import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { getCHWProfile } from '@/services/db/chwProfiles';

export default function SplashScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Check profile and redirect
    const init = async () => {
      const profile = await getCHWProfile();
      
      setTimeout(() => {
        if (profile) {
          router.replace('/(chw)');
        } else {
          router.replace('/(auth)/create-profile');
        }
      }, 1500);
    };

    init();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.dot, { backgroundColor: colors.primary, transform: [{ scale: pulseAnim }] }]} />
        <BitheatText variant="heading" style={styles.logoText}>Bitheat</BitheatText>
      </View>
      <BitheatText variant="body" color={colors.textSecondary} style={styles.tagline}>
        Health data that survives anything
      </BitheatText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  logoText: {
    fontSize: 32,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.8,
  }
});
