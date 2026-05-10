import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useSyncStore } from '@/stores/syncStore';
import { useTheme } from '@/design/theme';
import { BitheatText } from './BitheatText';
import { Ionicons } from '@expo/vector-icons';

export const SyncStatusBar: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { syncStatus, pendingCount, refreshCounts } = useSyncStore();
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    refreshCounts();
    const interval = setInterval(refreshCounts, 30000); // Every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (syncStatus === 'syncing') {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [syncStatus]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (pendingCount === 0 && syncStatus === 'idle') return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, margin: spacing.md }]}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons 
          name={syncStatus === 'syncing' ? "sync" : "cloud-upload-outline"} 
          size={18} 
          color={syncStatus === 'error' ? colors.danger : colors.primary} 
        />
      </Animated.View>
      
      <BitheatText variant="body" style={styles.text}>
        {syncStatus === 'syncing' ? 'Syncing health records...' : 
         syncStatus === 'error' ? 'Sync error' : 
         `${pendingCount} records pending sync`}
      </BitheatText>
      
      {pendingCount > 0 && syncStatus === 'idle' && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <BitheatText variant="body" color="white" style={styles.badgeText}>{pendingCount}</BitheatText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  }
});
