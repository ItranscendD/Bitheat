import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { BitheatDIDDisplay } from '@/components/ui/BitheatDIDDisplay';
import { getChild } from '@/services/db/children';
import { getCareEventsForChild } from '@/services/db/careEvents';
import { calculateDueVaccines, VaccineStatus } from '@/services/vaccineSchedule';
import { Ionicons } from '@expo/vector-icons';
import { useCareStore } from '@/stores/careStore';
import { ZKPGenerationModal } from '@/components/zkp/ZKPGenerationModal';

export default function ChildRecordScreen() {
  const { id } = useLocalSearchParams();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const setChildId = useCareStore(state => state.setChildId);
  
  const [child, setChild] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [vaccines, setVaccines] = useState<VaccineStatus[]>([]);
  const [zkpModalVisible, setZkpModalVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      const resChild = await getChild(id as string);
      const resEvents = await getCareEventsForChild(id as string);
      
      if (resChild.success && resChild.data) {
        setChild(resChild.data);
        const eventData = resEvents.success ? resEvents.data : [];
        setEvents(eventData);
        setVaccines(calculateDueVaccines(resChild.data.dob, eventData));
      }
    };
    load();
  }, [id]);

  const handleAddService = () => {
    setChildId(id as string);
    router.push('/(chw)/records/add-service');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#10B981'; // Green
      case 'due': return '#F59E0B';      // Amber
      case 'overdue': return '#EF4444';  // Red
      default: return colors.textSecondary;
    }
  };

  if (!child) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.profile}>
             <BitheatText variant="heading" style={styles.name}>{child.name}</BitheatText>
             <BitheatText variant="body" color={colors.textSecondary}>
               {child.sex?.toUpperCase()} • {child.dob}
             </BitheatText>
          </View>
        </View>

        <BitheatDIDDisplay did={child.did} />

        <View style={styles.section}>
          <BitheatText variant="heading" style={styles.sectionTitle}>Vaccination Card</BitheatText>
          <View style={styles.vaxGrid}>
            {vaccines.map((v, i) => (
              <View key={i} style={[styles.vaxItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(v.status) }]} />
                <View style={styles.vaxInfo}>
                   <BitheatText variant="body" style={styles.vaxName}>{v.name} {v.dose > 0 ? `(Dose ${v.dose})` : ''}</BitheatText>
                   <BitheatText variant="body" color={colors.textSecondary} style={{ fontSize: 12 }}>
                     {v.status === 'complete' ? 'Completed' : `Due: ${v.dueDate}`}
                   </BitheatText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <BitheatText variant="heading" style={styles.sectionTitle}>History</BitheatText>
          {events.length === 0 ? (
            <BitheatText variant="body" color={colors.textSecondary}>No care events recorded yet.</BitheatText>
          ) : (
            <View style={styles.timeline}>
              {events.map((e, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                  <BitheatCard variant="data" style={styles.timelineCard}>
                    <BitheatText variant="heading" style={styles.eventTitle}>{e.type.toUpperCase()}</BitheatText>
                    <BitheatText variant="body" color={colors.textSecondary}>
                      {new Date(e.timestamp).toLocaleDateString()}
                    </BitheatText>
                    {/* Details from JSON details_json could be parsed here */}
                  </BitheatCard>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <BitheatText variant="heading" style={styles.sectionTitle}>Privacy-First Actions</BitheatText>
          <BitheatButton
            label="Share Verifiable Proof"
            variant="secondary"
            onPress={() => setZkpModalVisible(true)}
            leftIcon={<Ionicons name="shield-checkmark" size={20} color={colors.primary} />}
            style={{ height: 52 }}
          />
          <BitheatText variant="body" color={colors.textSecondary} style={{ fontSize: 12, marginTop: 8 }}>
            Prove vaccination status without revealing child identity or full medical record.
          </BitheatText>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <ZKPGenerationModal 
        visible={zkpModalVisible} 
        onClose={() => setZkpModalVisible(false)} 
        child={child}
        vaccines={vaccines.filter(v => v.status === 'complete')}
      />

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.surface }]}>
        <BitheatButton
          label="Add Service"
          onPress={handleAddService}
          size="lg"
          style={styles.addBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  profile: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    marginBottom: 4,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  vaxGrid: {
    gap: 12,
  },
  vaxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vaxInfo: {
    flex: 1,
  },
  vaxName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeline: {
    paddingLeft: 8,
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  timelineCard: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    borderTopWidth: 1,
  },
  addBtn: {
    width: '100%',
  }
});
