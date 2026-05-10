import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatQRCode } from '@/components/qr/BitheatQRCode';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Ionicons } from '@expo/vector-icons';

export default function QRDisplayScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { childDID, name, dob, sex } = useRegistrationStore();
  const [doneVisible, setDoneVisible] = useState(false);

  const handleAction = () => {
    setDoneVisible(true);
  };

  const handleDone = () => {
    router.replace('/(chw)/register/success');
  };

  if (!childDID) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        </View>

        <BitheatText variant="heading" style={styles.title}>Health Passport</BitheatText>
        
        <View style={styles.qrContainer}>
          <BitheatQRCode 
            did={childDID} 
            childName={name || ''}
            childDOB={dob || ''}
            size={260}
          />
          <View style={styles.childInfo}>
            <BitheatText variant="heading" style={styles.childName}>{name}</BitheatText>
            <BitheatText variant="body" color={colors.textSecondary}>
              {sex?.toUpperCase()} • Born {dob}
            </BitheatText>
          </View>
        </View>

        <View style={styles.footer}>
          <BitheatButton
            label="Print health card"
            onPress={handleAction}
            leftIcon={<Ionicons name="print-outline" size={20} color="white" />}
            size="lg"
            style={styles.button}
          />
          <BitheatButton
            label="Save to device"
            onPress={handleAction}
            variant="secondary"
            size="lg"
            style={styles.button}
          />
          <BitheatButton
            label="Share"
            onPress={handleAction}
            variant="ghost"
            size="lg"
            style={styles.button}
          />
          
          {doneVisible && (
            <BitheatButton
              label="Finish Registration"
              onPress={handleDone}
              size="lg"
              style={[styles.button, { marginTop: 12 }]}
            />
          )}
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
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  childInfo: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  childName: {
    fontSize: 20,
  },
  footer: {
    gap: 12,
  },
  button: {
    width: '100%',
  }
});
