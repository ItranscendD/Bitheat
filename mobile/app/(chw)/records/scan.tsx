import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { BitheatQRScanner } from '@/components/qr/BitheatQRScanner';
import { parseQRPayload } from '@/services/qr/qrPayload';
import { getChildByDID } from '@/services/db/children';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (data: string) => {
    try {
      // For now, we'll bypass full cryptographic verification during scan for simplicity
      // In a real app, we'd fetch the CHW's public key from SecureStore
      const res = await getChildByDID(data); // Simplified: Assuming QR data is just the DID for now or handle parsing
      
      if (res.success && res.data) {
        router.replace(`/(chw)/records/${res.data.id}`);
      } else {
        setError('Child record not found in local database.');
      }
    } catch (e) {
      setError('Invalid or unrecognized QR code.');
    }
  };

  return (
    <View style={styles.container}>
      <BitheatQRScanner 
        onScan={handleScan}
        torch={torch}
      />
      
      <View style={styles.overlay}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
         </View>

         <View style={styles.instruction}>
            <BitheatText variant="body" style={styles.instructionText}>
              Point camera at the child's QR card
            </BitheatText>
         </View>

         {error && (
            <View style={[styles.errorCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
              <BitheatText variant="body" style={{ color: '#EF4444' }}>{error}</BitheatText>
              <TouchableOpacity onPress={() => setError(null)}>
                <BitheatText variant="body" color={colors.primary}>Retry</BitheatText>
              </TouchableOpacity>
            </View>
         )}

         <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
              onPress={() => setTorch(!torch)}
            >
              <Ionicons name={torch ? "flash" : "flash-off"} size={24} color="white" />
            </TouchableOpacity>
            
            <BitheatButton 
              label="Enter manually" 
              variant="ghost" 
              onPress={() => router.push('/(chw)/records/search')}
              style={{ color: 'white' }}
            />
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    paddingTop: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    textAlign: 'center',
  },
  errorCard: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  iconBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
