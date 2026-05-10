import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { Ionicons } from '@expo/vector-icons';

export default function OptionalSyncScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  const handleSync = async () => {
    // In a real app, call celoService.syncRegistry()
    router.replace('/(chw)');
  };

  const handleSkip = () => {
    router.replace('/(chw)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        </View>

        <BitheatText variant="heading" style={styles.title}>Sync zone registry?</BitheatText>
        <BitheatText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          This downloads the list of health facilities and active protocols in your zone. You can skip and sync later.
        </BitheatText>

        <View style={styles.footer}>
          <BitheatButton
            label="Sync Now"
            onPress={handleSync}
            leftIcon={<Ionicons name="wifi-outline" size={20} color="white" />}
            size="lg"
            style={styles.button}
          />
          <BitheatButton
            label="Skip for now"
            onPress={handleSkip}
            variant="ghost"
            size="lg"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
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
  title: {
    fontSize: 28,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  footer: {
    gap: 12,
  },
  button: {
    width: '100%',
  }
});
