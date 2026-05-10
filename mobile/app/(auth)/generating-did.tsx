import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { useAuthStore } from '@/stores/authStore';
import { generateDID, storeDIDKey } from '@/services/did/didGenerator';
import { createCHWProfile } from '@/services/db/chwProfiles';

export default function GeneratingDidScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { name, pin, zone, facilityId } = useAuthStore();
  const [status, setStatus] = useState('Generating keys...');
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const runTasks = async () => {
      const startTime = Date.now();
      
      try {
        // 1. Generate DID
        const { did, privateKey } = await generateDID();
        
        setStatus('Securing locally...');
        // 2. Store Key
        await storeDIDKey(did, privateKey, pin);
        
        setStatus('Creating profile...');
        // 3. Create DB Profile
        await createCHWProfile({
          id: did,
          did: did,
          name: name,
          facility_id: facilityId,
          zone: zone,
          created_at: new Date().toISOString()
        } as any);

        // Ensure at least 2000ms elapsed
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2000 - elapsed);
        
        setTimeout(() => {
          router.replace('/(auth)/optional-sync');
        }, remaining);

      } catch (error) {
        console.error('Onboarding failed:', error);
        alert('Failed to create identity. Please restart.');
      }
    };

    runTasks();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
       <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
        </View>

      <View style={styles.center}>
        <Animated.View 
          style={[
            styles.spinner, 
            { borderColor: colors.primary, borderTopColor: 'transparent', transform: [{ rotate: spin }] }
          ]} 
        />
        <BitheatText variant="heading" style={styles.title}>Creating your secure identity</BitheatText>
        <BitheatText variant="body" color={colors.textSecondary} style={styles.subtitle}>{status}</BitheatText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  }
});
