import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { useCareStore, ServiceType } from '@/stores/careStore';
import { Ionicons } from '@expo/vector-icons';

export default function AddServiceScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const setServiceType = useCareStore(state => state.setServiceType);

  const handleSelect = (type: ServiceType) => {
    setServiceType(type);
    router.push('/(chw)/records/service-details');
  };

  const ServiceCard = ({ type, label, icon, color }: { type: ServiceType, label: string, icon: any, color: string }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface }]} 
      onPress={() => handleSelect(type)}
    >
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <BitheatText variant="heading" style={styles.label}>{label}</BitheatText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <BitheatText variant="heading" style={styles.title}>New Service</BitheatText>
          <View style={{ width: 24 }} />
        </View>

        <BitheatText variant="heading" style={styles.heading}>What type of service?</BitheatText>

        <View style={styles.grid}>
          <ServiceCard type="vaccination" label="Vaccination" icon="medkit" color="#10B981" />
          <ServiceCard type="treatment" label="Treatment" icon="flask" color="#6366F1" />
          <ServiceCard type="checkup" label="Checkup" icon="pulse" color="#F59E0B" />
          <ServiceCard type="referral" label="Referral" icon="arrow-forward" color="#6B7280" />
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
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
  },
  heading: {
    fontSize: 28,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  }
});
