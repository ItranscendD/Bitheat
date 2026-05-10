import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { useRegistrationStore } from '@/stores/registrationStore';
import { generateDID } from '@/services/did/didGenerator';
import { createChild } from '@/services/db/children';
import { enqueueSync } from '@/services/db/syncQueue';

export default function GeneratingScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { name, dob, sex, guardianId, photoHash, setIdentity } = useRegistrationStore();
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const run = async () => {
      const startTime = Date.now();
      
      try {
        // 1. Generate DID
        const { did } = await generateDID();
        
        // 2. Create local record
        const childData = {
          id: did,
          did: did,
          name: name,
          dob: dob || '',
          sex: sex || 'unknown',
          guardian_id: guardianId || '',
          photo_hash: photoHash || '',
          sync_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const resCreate = await createChild(childData as any);
        if (!resCreate.success) throw resCreate.error;
        
        // 3. Enqueue for background sync
        const resSync = await enqueueSync('child', did, 1);
        if (!resSync.success) throw resSync.error;
        
        // 4. Update store
        setIdentity(did, 'pending_ipfs_cid');

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1500 - elapsed);
        
        setTimeout(() => {
          router.replace('/(chw)/register/qr-display');
        }, remaining);

      } catch (error) {
        console.error('Registration failed:', error);
        alert('Failed to generate identity. Please try again.');
        router.back();
      }
    };

    run();
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
        <BitheatText variant="heading" style={styles.title}>Creating health identity</BitheatText>
        <BitheatText variant="body" color={colors.textSecondary}>This works completely offline</BitheatText>
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
    marginBottom: 8,
  }
});
