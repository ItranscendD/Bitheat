import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatInput } from '@/components/ui/BitheatInput';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatCard } from '@/components/ui/BitheatCard';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Ionicons } from '@expo/vector-icons';

export default function LinkGuardianScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { guardianId, setGuardian } = useRegistrationStore();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleSelect = (id: string, name: string, phone: string) => {
    setGuardian(id, name, phone);
  };

  const handleContinue = () => {
    if (isCreating) {
       // In a real app, generate a DID for the new guardian or use a temporary ID
       const tempId = `guardian_${Date.now()}`;
       setGuardian(tempId, newName, newPhone);
    }
    
    if (guardianId || (isCreating && newName)) {
      router.push('/(chw)/register/capture-photo');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
        </View>

        <BitheatText variant="heading" style={styles.title}>Link guardian</BitheatText>

        {!isCreating ? (
          <View style={styles.content}>
            <BitheatInput
              placeholder="Search by name or phone"
              value={search}
              onChangeText={setSearch}
              fieldMode
              leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
            />

            <TouchableOpacity 
              style={[styles.newGuardianBtn, { borderColor: colors.primary }]} 
              onPress={() => setIsCreating(true)}
            >
              <Ionicons name="add" size={24} color={colors.primary} />
              <BitheatText variant="body" color={colors.primary}>New guardian</BitheatText>
            </TouchableOpacity>

            <View style={styles.results}>
              <BitheatText variant="body" color={colors.textSecondary} style={styles.resultsTitle}>
                Recent guardians
              </BitheatText>
              
              {/* Mock result */}
              <TouchableOpacity onPress={() => handleSelect('g1', 'Sarah Ahmed', '08012345678')}>
                <BitheatCard 
                  variant="data" 
                  title="Sarah Ahmed"
                  style={[styles.card, guardianId === 'g1' && { borderColor: colors.primary, borderWidth: 2 }]}
                >
                  <View style={styles.cardHeader}>
                    <BitheatText variant="heading" style={styles.cardName}>Sarah Ahmed</BitheatText>
                    {guardianId === 'g1' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                  </View>
                  <BitheatText variant="body" color={colors.textSecondary}>08012345678</BitheatText>
                </BitheatCard>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <BitheatInput
              label="Guardian Name"
              value={newName}
              onChangeText={setNewName}
              fieldMode
            />
            <BitheatInput
              label="Phone Number"
              value={newPhone}
              onChangeText={setNewPhone}
              fieldMode
              keyboardType="phone-pad"
            />
            <BitheatButton 
              label="Cancel" 
              variant="ghost" 
              onPress={() => setIsCreating(false)} 
            />
          </View>
        )}

        <View style={styles.footer}>
          <BitheatButton
            label="Continue"
            onPress={handleContinue}
            disabled={!guardianId && !(isCreating && newName)}
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
  content: {
    flex: 1,
    gap: 20,
  },
  form: {
    flex: 1,
    gap: 20,
  },
  newGuardianBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    gap: 8,
  },
  results: {
    gap: 12,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
  },
  button: {
    width: '100%',
  }
});
