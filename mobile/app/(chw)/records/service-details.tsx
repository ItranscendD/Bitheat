import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatInput } from '@/components/ui/BitheatInput';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { useCareStore } from '@/stores/careStore';
import { Ionicons } from '@expo/vector-icons';
import vaccineData from '@/assets/data/who-epi-vaccines.json';

export default function ServiceDetailsScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { serviceType, details, updateDetails } = useCareStore();

  const handleReview = () => {
    router.push('/(chw)/records/confirm-service');
  };

  const renderVaccinationForm = () => (
    <View style={styles.form}>
      <BitheatInput
        label="Vaccine"
        placeholder="Select vaccine"
        value={details.vaccineId || ''}
        onChangeText={(text) => updateDetails({ vaccineId: text })}
        fieldMode
      />
      <BitheatInput
        label="Dose Number"
        placeholder="e.g. 1"
        value={details.dose?.toString() || ''}
        onChangeText={(text) => updateDetails({ dose: parseInt(text) || 0 })}
        keyboardType="numeric"
        fieldMode
      />
      <BitheatInput
        label="Batch Number"
        placeholder="e.g. B-12345"
        value={details.batchNumber || ''}
        onChangeText={(text) => updateDetails({ batchNumber: text })}
        fieldMode
      />
    </View>
  );

  const renderTreatmentForm = () => (
    <View style={styles.form}>
      <BitheatInput
        label="Diagnosis"
        placeholder="Describe the condition"
        value={details.diagnosis || ''}
        onChangeText={(text) => updateDetails({ diagnosis: text })}
        fieldMode
      />
      <BitheatInput
        label="Medication"
        placeholder="e.g. Amoxicillin"
        value={details.medication || ''}
        onChangeText={(text) => updateDetails({ medication: text })}
        fieldMode
      />
      <BitheatInput
        label="Instructions / Notes"
        placeholder="e.g. 2 times daily"
        value={details.notes || ''}
        onChangeText={(text) => updateDetails({ notes: text })}
        fieldMode
        multiline
      />
    </View>
  );

  const renderCheckupForm = () => (
    <View style={styles.form}>
      <BitheatInput
        label="Weight (kg)"
        placeholder="0.0"
        value={details.weight || ''}
        onChangeText={(text) => updateDetails({ weight: text })}
        keyboardType="decimal-pad"
        fieldMode
      />
      <BitheatInput
        label="Height (cm)"
        placeholder="0.0"
        value={details.height || ''}
        onChangeText={(text) => updateDetails({ height: text })}
        keyboardType="decimal-pad"
        fieldMode
      />
      <BitheatInput
        label="Clinical Notes"
        value={details.notes || ''}
        onChangeText={(text) => updateDetails({ notes: text })}
        fieldMode
        multiline
      />
    </View>
  );

  const renderReferralForm = () => (
    <View style={styles.form}>
      <BitheatInput
        label="Referral Destination"
        placeholder="e.g. Kano General Hospital"
        value={details.referralTo || ''}
        onChangeText={(text) => updateDetails({ referralTo: text })}
        fieldMode
      />
      <BitheatInput
        label="Reason for Referral"
        value={details.notes || ''}
        onChangeText={(text) => updateDetails({ notes: text })}
        fieldMode
        multiline
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <BitheatText variant="heading" style={styles.title}>
            {serviceType?.toUpperCase()} Details
          </BitheatText>
          <View style={{ width: 24 }} />
        </View>

        {serviceType === 'vaccination' && renderVaccinationForm()}
        {serviceType === 'treatment' && renderTreatmentForm()}
        {serviceType === 'checkup' && renderCheckupForm()}
        {serviceType === 'referral' && renderReferralForm()}

        <View style={styles.footer}>
          <BitheatButton
            label="Review Service"
            onPress={handleReview}
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
  form: {
    gap: 20,
    flex: 1,
  },
  footer: {
    marginTop: 40,
  },
  button: {
    width: '100%',
  }
});
