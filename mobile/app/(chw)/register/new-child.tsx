import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatInput } from '@/components/ui/BitheatInput';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Ionicons } from '@expo/vector-icons';

export default function NewChildScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { name, dob, sex, setName, setDOB, setSex } = useRegistrationStore();

  const handleContinue = () => {
    if (name && dob && sex) {
      router.push('/(chw)/register/link-guardian');
    }
  };

  const SexCard = ({ type, label, icon }: { type: 'male' | 'female' | 'unknown', label: string, icon: any }) => {
    const selected = sex === type;
    return (
      <TouchableOpacity 
        style={[
          styles.sexCard, 
          { 
            backgroundColor: colors.surface, 
            borderColor: selected ? colors.primary : 'transparent',
            borderWidth: 2
          }
        ]} 
        onPress={() => setSex(type)}
      >
        <Ionicons name={icon} size={32} color={selected ? colors.primary : colors.textSecondary} />
        <BitheatText variant="body" style={[styles.sexLabel, { color: selected ? colors.primary : colors.textSecondary }]}>
          {label}
        </BitheatText>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
        </View>

        <BitheatText variant="heading" style={styles.title}>Child's identity</BitheatText>

        <View style={styles.form}>
          <BitheatInput
            label="Full Name"
            placeholder="Legal or preferred name"
            value={name}
            onChangeText={setName}
            fieldMode
          />

          <View style={styles.inputGroup}>
             <BitheatText variant="body" style={styles.label}>Estimated DOB</BitheatText>
             <BitheatInput
                placeholder="YYYY-MM-DD"
                value={dob || ''}
                onChangeText={setDOB}
                fieldMode
                // In a real app, this would be a wheel picker modal
             />
          </View>

          <View style={styles.inputGroup}>
            <BitheatText variant="body" style={styles.label}>Sex</BitheatText>
            <View style={styles.sexRow}>
              <SexCard type="male" label="Boy" icon="male" />
              <SexCard type="female" label="Girl" icon="female" />
              <SexCard type="unknown" label="Unknown" icon="help-circle" />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <BitheatButton
            label="Continue"
            onPress={handleContinue}
            disabled={!name || !dob || !sex}
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
    gap: 24,
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  sexRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sexCard: {
    flex: 1,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  sexLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
  },
  button: {
    width: '100%',
  }
});
