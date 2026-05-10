import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatInput } from '@/components/ui/BitheatInput';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { searchChildren } from '@/services/db/children';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const search = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      const res = await searchChildren(query);
      if (res.success) {
        setResults(res.data);
      }
    };

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const renderItem = ({ item }: { item: any }) => (
    <BitheatCard 
      variant="data" 
      style={styles.card} 
      onPress={() => router.push(`/(chw)/records/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.details}>
          <BitheatText variant="heading" style={styles.name}>{item.name}</BitheatText>
          <BitheatText variant="body" color={colors.textSecondary}>
            Born {item.dob} • {item.sex?.toUpperCase()}
          </BitheatText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </BitheatCard>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <BitheatText variant="heading" style={styles.title}>Search Child</BitheatText>
          <View style={{ width: 24 }} />
        </View>

        <BitheatInput
          placeholder="Search by name or date of birth"
          value={query}
          onChangeText={setQuery}
          fieldMode
          autoFocus
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
        />

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            query ? (
              <View style={styles.empty}>
                <BitheatText variant="body" color={colors.textSecondary}>No matches found.</BitheatText>
                <BitheatText variant="body" color={colors.textSecondary}>Check spelling or register new child.</BitheatText>
              </View>
            ) : null
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
  },
  list: {
    paddingTop: 20,
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 4,
  }
});
