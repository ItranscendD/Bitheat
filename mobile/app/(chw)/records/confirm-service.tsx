import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { useCareStore } from '@/stores/careStore';
import { createCareEvent } from '@/services/db/careEvents';
import { enqueueSync } from '@/services/db/syncQueue';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmServiceScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { childId, serviceType, details, reset } = useCareStore();

  const handleConfirm = async () => {
    if (!childId || !serviceType) return;

    try {
      const eventId = `event_${Date.now()}`;
      const eventData = {
        id: eventId,
        child_id: childId,
        type: serviceType,
        details_json: JSON.stringify(details),
        timestamp: new Date().toISOString(),
        chw_did_hash: 'current_chw_hash', // In real app, get from auth store
        sync_status: 'pending'
      };

      // 1. Save locally
      const resCreate = await createCareEvent(eventData as any);
      if (!resCreate.success) throw resCreate.error;
      
      // 2. Enqueue for sync
      const resSync = await enqueueSync('care_event', eventId, 1);
      if (!resSync.success) throw resSync.error;
      
      // 3. Cleanup and redirect
      reset();
      router.replace(`/(chw)/records/${childId}`);
      alert('Care record saved successfully.');
    } catch (error) {
      console.error('Failed to save care event:', error);
      alert('Failed to save record. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <BitheatText variant="heading" style={styles.title}>Review care record</BitheatText>
          <View style={{ width: 24 }} />
        </View>

        <BitheatCard variant="data" style={styles.summaryCard}>
          <View style={styles.row}>
            <BitheatText variant="body" color={colors.textSecondary}>Service Type</BitheatText>
            <BitheatText variant="heading" style={styles.value}>{serviceType?.toUpperCase()}</BitheatText>
          </View>
          
          <View style={styles.divider} />

          {Object.entries(details).map(([key, val]) => (
            <View key={key} style={styles.row}>
               <BitheatText variant="body" color={colors.textSecondary} style={styles.label}>
                 {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
               </BitheatText>
               <BitheatText variant="body" style={styles.value}>{val}</BitheatText>
            </View>
          ))}
        </BitheatCard>

        <View style={styles.footer}>
          <BitheatButton
            label="Confirm and save"
            onPress={handleConfirm}
            size="lg"
            style={styles.button}
          />
          <BitheatButton
            label="Edit details"
            onPress={() => router.back()}
            variant="ghost"
            size="lg"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
  },
  summaryCard: {
    padding: 24,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    textTransform: 'capitalize',
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 8,
  },
  footer: {
    marginTop: 40,
    gap: 12,
  },
  button: {
    width: '100%',
  }
});
