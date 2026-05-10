import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { getCHWProfile } from '@/services/db/chwProfiles';
import { useSyncStore } from '@/stores/syncStore';
import { ChildRecord } from '@bitheat/shared';
import { getChildren } from '@/services/db/children';

export default function DashboardScreen() {
  const { colors, spacing } = useTheme();
  const { pendingCount, lastSyncAt } = useSyncStore();
  const [profile, setProfile] = useState<any>(null);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const p = await getCHWProfile();
      setProfile(p);

      const children = await getChildren();
      // Filter for today's registrations
      const today = new Date().toISOString().split('T')[0];
      const count = children.filter(c => c.created_at.startsWith(today)).length;
      setTodayCount(count);
    };

    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <BitheatText variant="body" color={colors.textSecondary}>{getGreeting()},</BitheatText>
          <BitheatText variant="heading" style={styles.name}>{profile?.name || 'CHW'}</BitheatText>
        </View>

        <View style={styles.grid}>
          <BitheatCard variant="data" style={styles.card}>
            <BitheatText variant="body" color={colors.textSecondary}>Registered Today</BitheatText>
            <BitheatText variant="heading" style={styles.kpi}>{todayCount}</BitheatText>
          </BitheatCard>

          <BitheatCard variant="data" style={styles.card}>
            <BitheatText variant="body" color={colors.textSecondary}>Pending Sync</BitheatText>
            <BitheatText variant="heading" style={[styles.kpi, { color: colors.primary }]}>{pendingCount}</BitheatText>
          </BitheatCard>

          <BitheatCard variant="data" style={styles.cardFull}>
            <BitheatText variant="body" color={colors.textSecondary}>Last Blockchain Sync</BitheatText>
            <BitheatText variant="heading" style={styles.kpiSmall}>
              {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Never'}
            </BitheatText>
          </BitheatCard>
        </View>

        <BitheatText variant="heading" style={styles.sectionTitle}>Recent Registrations</BitheatText>
        <BitheatText variant="body" color={colors.textSecondary}>Register children to see them here.</BitheatText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  name: {
    fontSize: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
  },
  cardFull: {
    width: '100%',
    padding: 20,
  },
  kpi: {
    fontSize: 32,
    marginTop: 8,
  },
  kpiSmall: {
    fontSize: 18,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
  }
});
