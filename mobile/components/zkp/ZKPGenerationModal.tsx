import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { generateVaccinationProof } from '@/services/zkp/proofGenerator';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

export function ZKPGenerationModal({ visible, onClose, child, vaccines }: any) {
  const { colors, spacing } = useTheme();
  const [step, setStep] = useState<'select' | 'generating' | 'display'>('select');
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);
  const [proofData, setProofData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!selectedVaccine) return;
    
    setStep('generating');
    try {
      // Simulate proof generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const res = await generateVaccinationProof({
        childDID: child.did,
        recordSalt: 'secure_salt_123',
        vaccineId: selectedVaccine.id === 'measles' ? 1 : 2,
        doseNumber: selectedVaccine.dose,
        recordHash: '0x_blockchain_hash',
        targetVaccineId: selectedVaccine.id === 'measles' ? 1 : 2
      });
      
      setProofData(res);
      setStep('display');
    } catch (e) {
      alert('Failed to generate proof. Cryptographic error.');
      setStep('select');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <BitheatText variant="heading" style={styles.title}>Verifiable Proof</BitheatText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {step === 'select' && (
            <View style={styles.body}>
              <BitheatText variant="body" color={colors.textSecondary} style={{ marginBottom: 20 }}>
                Select a vaccination record to generate a privacy-preserving proof.
              </BitheatText>
              
              {vaccines.map((v: any, i: number) => (
                <TouchableOpacity 
                  key={i} 
                  style={[
                    styles.vaxItem, 
                    { backgroundColor: colors.surface },
                    selectedVaccine === v && { borderColor: colors.primary, borderWidth: 2 }
                  ]}
                  onPress={() => setSelectedVaccine(v)}
                >
                  <Ionicons name="medkit" size={20} color={colors.primary} />
                  <BitheatText variant="body" style={{ fontWeight: '600' }}>{v.name} (Dose {v.dose})</BitheatText>
                </TouchableOpacity>
              ))}

              <BitheatButton 
                label="Generate Proof" 
                onPress={handleGenerate} 
                disabled={!selectedVaccine}
                style={{ marginTop: 20 }}
              />
            </View>
          )}

          {step === 'generating' && (
            <View style={styles.centered}>
               <ActivityIndicator size="large" color={colors.primary} />
               <BitheatText variant="heading" style={{ marginTop: 20 }}>Generating ZKP</BitheatText>
               <BitheatText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 8 }}>
                 Securing health claims with zero-knowledge math...
               </BitheatText>
            </View>
          )}

          {step === 'display' && (
            <View style={styles.centered}>
               <View style={styles.qrContainer}>
                  <QRCode 
                    value={JSON.stringify(proofData)} 
                    size={200}
                    color={colors.text}
                    backgroundColor={colors.background}
                  />
               </View>
               <BitheatText variant="body" style={{ fontWeight: '600', marginTop: 20 }}>
                 Verified Proof Generated
               </BitheatText>
               <BitheatText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 24 }}>
                 Scan this QR at the receiving clinic.
               </BitheatText>
               <BitheatButton label="Done" onPress={onClose} variant="secondary" fullWidth />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
  },
  body: {
    flex: 1,
  },
  vaxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  }
});
