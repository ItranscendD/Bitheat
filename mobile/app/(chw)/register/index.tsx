import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { listChildren } from '@/services/db/children';
import { Ionicons } from '@expo/vector-icons';
import { useRegistrationStore } from '@/stores/registrationStore';

export default function RegisterDashboard() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const resetRegistration = useRegistrationStore(state => state.reset);

  useEffect(() => {
    const load = async () => {
      const res = await listChildren(100);
      if (res.success) {
        const all = res.data;
        const today = new Date().toISOString().split('T')[0];
        setChildren(all.filter((c: any) => c.createdAt.startsWith(today)));
      }
    };
    load();
  }, []);

  const handleNewChild = () => {
    resetRegistration();
    router.push('/(chw)/register/new-child');
  };

  const renderItem = ({ item }: { item: any }) => (
    <BitheatCard variant="data" title={item.name} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={colors.primary} />
        </View>
        <View style={styles.details}>
          <BitheatText variant="heading" style={styles.childName}>{item.name}</BitheatText>
          <BitheatText variant="body" color={colors.textSecondary}>
            Registered {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </BitheatText>
        </View>
        <View style={[styles.badge, { backgroundColor: item.celo_tx_hash ? colors.primary : colors.surface }]}>
          <BitheatText variant="body" color="white" style={styles.badgeText}>
            {item.celo_tx_hash ? 'Synced' : 'Pending'}
          </BitheatText>
        </View>
      </View>
    </BitheatCard>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <BitheatText variant="heading" style={styles.title}>Register</BitheatText>
          <View style={[styles.offlineBadge, { backgroundColor: colors.surface }]}>
            <Ionicons name="cloud-offline-outline" size={14} color={colors.textSecondary} />
            <BitheatText variant="body" color={colors.textSecondary} style={styles.offlineText}>Offline Mode</BitheatText>
          </View>
        </View>

        <BitheatButton
          label="New Child"
          onPress={handleNewChild}
          leftIcon={<Ionicons name="add-circle" size={24} color="white" />}
          size="lg"
          style={styles.mainButton}
        />

        <BitheatText variant="heading" style={styles.sectionTitle}>Today's registrations</BitheatText>

        <FlatList
          data={children}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <BitheatText variant="body" color={colors.textSecondary}>No children registered today.</BitheatText>
              <BitheatText variant="body" color={colors.textSecondary}>Tap 'New child' to start.</BitheatText>
            </View>
          }
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  offlineText: {
    fontSize: 12,
  },
  mainButton: {
    width: '100%',
    marginBottom: 40,
    height: 56,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    marginBottom: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 4,
  }
});
