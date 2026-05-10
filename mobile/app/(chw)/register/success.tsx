import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { name, childDID, reset } = useRegistrationStore();

  const handleRegisterAnother = () => {
    reset();
    router.replace('/(chw)/register/new-child');
  };

  const handleViewRecord = () => {
    router.replace('/(chw)/records');
  };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.container, { padding: spacing.lg }]}>
          <View style={styles.center}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
            </View>

            <BitheatText variant="heading" style={styles.title}>{name} is now registered</BitheatText>

            <View style={[styles.didBox, { backgroundColor: colors.surface }]}>
              <BitheatText variant="body" color={colors.textSecondary} style={styles.didLabel}>Health DID</BitheatText>
              <BitheatText variant="body" style={styles.didValue}>{childDID?.slice(0, 24)}...</BitheatText>
            </View>

            <View style={styles.syncStatus}>
              <Ionicons name="cloud-upload-outline" size={16} color={colors.textSecondary} />
              <BitheatText variant="body" color={colors.textSecondary}>Will sync to blockchain when connected</BitheatText>
            </View>
          </View>

          <View style={styles.footer}>
            <BitheatButton
              label="View record"
              onPress={handleViewRecord}
              size="lg"
              style={styles.button}
            />
            <BitheatButton
              label="Register another child"
              onPress={handleRegisterAnother}
              variant="secondary"
              size="lg"
              style={styles.button}
            />
            <BitheatButton
              label="Back to Dashboard"
              onPress={() => router.replace('/')}
              variant="ghost"
              size="lg"
              style={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    didBox: {
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
    },
    didLabel: {
      fontSize: 12,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    didValue: {
      fontSize: 14,
      fontFamily: 'SpaceMono_400Regular',
    },
    syncStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    footer: {
      gap: 12,
    },
    button: {
      width: '100%',
    }
  });
