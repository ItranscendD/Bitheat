import React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatBadge } from '@/components/ui/BitheatBadge';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { BitheatInput } from '@/components/ui/BitheatInput';
import { BitheatDIDDisplay } from '@/components/ui/BitheatDIDDisplay';
import { SyncStatusBar } from '@/components/ui/SyncStatusBar';
import { Ionicons } from '@expo/vector-icons';

export default function ComponentsGallery() {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SyncStatusBar />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <BitheatText variant="displayL" style={styles.sectionTitle}>Component Gallery</BitheatText>
        
        {/* Typography Section */}
        <View style={styles.section}>
          <BitheatText variant="heading" color={colors.primary}>Typography</BitheatText>
          <BitheatText variant="displayXL">Display XL</BitheatText>
          <BitheatText variant="displayL">Display L</BitheatText>
          <BitheatText variant="heading">Heading</BitheatText>
          <BitheatText variant="bodyL">Body Large</BitheatText>
          <BitheatText variant="body">Body Regular</BitheatText>
          <BitheatText variant="caption">Caption Text</BitheatText>
          <BitheatText variant="mono">Monospace DID: 123456789</BitheatText>
        </View>

        {/* Buttons Section */}
        <View style={styles.section}>
          <BitheatText variant="heading" color={colors.primary}>Buttons</BitheatText>
          <BitheatButton label="Primary Button" onPress={() => {}} style={styles.element} />
          <BitheatButton label="Secondary (Blockchain)" variant="secondary" onPress={() => {}} style={styles.element} />
          <BitheatButton label="Danger Button" variant="danger" onPress={() => {}} style={styles.element} />
          <BitheatButton label="Large Button (P0)" size="lg" onPress={() => {}} style={styles.element} />
          <BitheatButton label="Ghost Button" variant="ghost" onPress={() => {}} style={styles.element} />
          <BitheatButton 
            label="With Icons" 
            leftIcon={<Ionicons name="add" size={20} color="#FFF" />} 
            onPress={() => {}} 
            style={styles.element} 
          />
          <BitheatButton label="Loading State" loading onPress={() => {}} style={styles.element} />
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <BitheatText variant="heading" color={colors.primary}>Badges</BitheatText>
          <View style={styles.row}>
            <BitheatBadge variant="online" />
            <BitheatBadge variant="offline" />
          </View>
          <View style={styles.row}>
            <BitheatBadge variant="syncing" />
            <BitheatBadge variant="anchored" />
          </View>
          <View style={styles.row}>
            <BitheatBadge variant="zkp" />
            <BitheatBadge variant="alert" />
          </View>
        </View>

        {/* Cards Section */}
        <View style={styles.section}>
          <BitheatText variant="heading" color={colors.primary}>Cards</BitheatText>
          <BitheatCard 
            variant="action"
            title="Register New Child"
            subtitle="Start a new health record"
            icon={<Ionicons name="person-add" size={24} color={colors.primary} />}
            onPress={() => {}}
          />
          <BitheatCard 
            variant="data"
            title="Chidubem Okafor"
            subtitle="MALE • 4 YEARS"
            body="Last vaccination: BCG (2 days ago)"
            footer={<BitheatBadge variant="anchored" size="sm" />}
          />
          <BitheatCard 
            variant="status"
            title="System Status"
            body="IPFS Node: Connected • Celo: Alfajores"
            statusColor={colors.primary}
          />
        </View>

        {/* Inputs Section */}
        <View style={styles.section}>
          <BitheatText variant="heading" color={colors.primary}>Inputs</BitheatText>
          <BitheatInput label="Full Name" placeholder="Enter child's name" />
          <BitheatInput label="Field Mode Input" placeholder="Larger touch target" fieldMode />
          <BitheatInput label="With Error" placeholder="Invalid input" error="This field is required" />
        </View>

        {/* Identity Section */}
        <View style={styles.section}>
          <BitheatText variant="heading" color={colors.primary}>Identity</BitheatText>
          <BitheatDIDDisplay did="did:key:z6MkpTHR8VNsBx7Bx5a9yXfQ3TqS2C8E5G7I9K1M3O5Q" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  element: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
});
