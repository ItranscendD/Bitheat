import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatInput } from '@/components/ui/BitheatInput';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { useAuthStore } from '@/stores/authStore';

export default function CreateProfileScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { name, facilityId, zone, setName, setFacilityId, setZone } = useAuthStore();

  const handleContinue = () => {
    if (name && facilityId && zone) {
      router.push('/(auth)/set-pin');
    }
  };

  const isFormValid = name.length >= 2 && facilityId.length >= 3 && zone.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        {/* Progress Dots */}
        <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
        </View>

        <BitheatText variant="heading" style={styles.title}>Create your profile</BitheatText>
        
        <View style={styles.form}>
          <BitheatInput
            label="Full Name"
            placeholder="e.g. Dr. Amina Bello"
            value={name}
            onChangeText={setName}
            fieldMode
          />
          
          <BitheatInput
            label="Facility ID"
            placeholder="e.g. PHC-KANO-01"
            value={facilityId}
            onChangeText={setFacilityId}
            fieldMode
          />

          <BitheatInput
            label="Zone / Region"
            placeholder="Select your operational zone"
            value={zone}
            onChangeText={setZone}
            fieldMode
          />
        </View>

        <View style={styles.footer}>
          <BitheatButton
            label="Continue"
            onPress={handleContinue}
            disabled={!isFormValid}
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
    marginBottom: 32,
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
