import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { Ionicons } from '@expo/vector-icons';

export default function RecordsLanding() {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  const mockRecentlyAccessed = [
    { id: '1', name: 'Amina Bello', age: '2y 4m', lastVisit: '2026-05-08' },
    { id: '2', name: 'Zubairu Sani', age: '8m', lastVisit: '2026-05-09' },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <BitheatCard 
      variant="data" 
      style={styles.card} 
      onPress={() => router.push(`/(chw)/records/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <BitheatText variant="heading" style={{ color: colors.primary }}>{item.name[0]}</BitheatText>
        </View>
        <View style={styles.details}>
          <BitheatText variant="heading" style={styles.childName}>{item.name}</BitheatText>
          <BitheatText variant="body" color={colors.textSecondary}>{item.age}</BitheatText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </BitheatCard>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { padding: spacing.lg }]}>
        <BitheatText variant="heading" style={styles.title}>Child Records</BitheatText>
        
        <View style={styles.actions}>
          <BitheatButton
            label="Scan QR"
            onPress={() => router.push('/(chw)/records/scan')}
            leftIcon={<Ionicons name="qr-code" size={24} color="white" />}
            size="lg"
            style={styles.actionBtn}
          />
          <BitheatButton
            label="Search child"
            onPress={() => router.push('/(chw)/records/search')}
            variant="secondary"
            leftIcon={<Ionicons name="search" size={24} color={colors.primary} />}
            size="lg"
            style={styles.actionBtn}
          />
        </View>

        <BitheatText variant="heading" style={styles.sectionTitle}>Recently accessed</BitheatText>
        
        <FlatList
          data={mockRecentlyAccessed}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <BitheatText variant="body" color={colors.textSecondary}>No recently accessed records.</BitheatText>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 32,
  },
  actions: {
    gap: 16,
    marginBottom: 48,
  },
  actionBtn: {
    width: '100%',
    height: 64,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  list: {
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
  }
});
