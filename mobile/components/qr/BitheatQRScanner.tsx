import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/design/theme';
import { BitheatText } from '../ui/BitheatText';
import { Ionicons } from '@expo/vector-icons';
import { verifyVaccinationProofLocally } from '@/services/zkp/proofVerifier';

interface BitheatQRScannerProps {
  onScanned: (data: string) => void;
  onClose: () => void;
}

export const BitheatQRScanner: React.FC<BitheatQRScannerProps> = ({
  onScanned,
  onClose,
}) => {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'valid' | 'invalid' | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || verifying) return;
    
    // Check if it's a ZKP Proof (JSON with proof field)
    if (data.startsWith('{') && data.includes('proof')) {
      setVerifying(true);
      try {
        const payload = JSON.parse(data);
        const isValid = await verifyVaccinationProofLocally(payload.proof, payload.publicSignals);
        setVerificationResult(isValid ? 'valid' : 'invalid');
        Haptics.notificationAsync(
          isValid ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
        );
      } catch (e) {
        setVerificationResult('invalid');
      }
      setVerifying(false);
      setScanned(true);
      return;
    }

    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onScanned(data);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', padding: 20 }]}>
        <BitheatText variant="heading" style={{ textAlign: 'center', marginBottom: 16 }}>Camera Permission Needed</BitheatText>
        <BitheatText variant="body" style={{ textAlign: 'center', marginBottom: 32 }}>
          We need camera access to scan Bitheat Health Passports at the clinic.
        </BitheatText>
        <TouchableOpacity 
          onPress={requestPermission}
          style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}
        >
          <BitheatText variant="heading" color="white">Grant Permission</BitheatText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>
          <View style={[styles.focusedContainer, { borderColor: scanned ? colors.primary : 'white' }]}>
             {/* Corner Brackets */}
             <View style={[styles.bracket, styles.topLeft, { borderColor: colors.primary }]} />
             <View style={[styles.bracket, styles.topRight, { borderColor: colors.primary }]} />
             <View style={[styles.bracket, styles.bottomLeft, { borderColor: colors.primary }]} />
             <View style={[styles.bracket, styles.bottomRight, { borderColor: colors.primary }]} />
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>

      {/* Controls */}
      <SafeAreaView style={styles.controls}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={() => setTorch(!torch)} style={styles.iconBtn}>
            <Ionicons name={torch ? "flashlight" : "flashlight-outline"} size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.manualEntry}>
            <BitheatText variant="body" color="white" style={{ textDecorationLine: 'underline' }}>
              Enter code manually
            </BitheatText>
          </TouchableOpacity>
          
          <View style={{ width: 44 }} /> {/* Spacer */}
        </View>
      </SafeAreaView>

      {scanned && !verificationResult && (
        <View style={[styles.successFlash, { backgroundColor: colors.primary + '40' }]} />
      )}

      {verificationResult && (
        <View style={styles.resultOverlay}>
          <View style={[styles.resultCard, { backgroundColor: colors.background }]}>
            <Ionicons 
              name={verificationResult === 'valid' ? "shield-checkmark" : "alert-circle"} 
              size={64} 
              color={verificationResult === 'valid' ? colors.primary : '#EF4444'} 
            />
            <BitheatText variant="heading" style={{ marginTop: 16 }}>
              {verificationResult === 'valid' ? "Proof Verified" : "Invalid Proof"}
            </BitheatText>
            <BitheatText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 8 }}>
              {verificationResult === 'valid' 
                ? "This child is confirmed to be vaccinated against the target vaccine Category."
                : "The cryptographic proof could not be verified. Do not admit based on this proof."}
            </BitheatText>
            <TouchableOpacity 
              onPress={() => {
                setScanned(false);
                setVerificationResult(null);
              }}
              style={[styles.closeResult, { backgroundColor: colors.primary }]}
            >
              <BitheatText variant="body" color="white" style={{ fontWeight: 'bold' }}>Done</BitheatText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: scannerSize,
  },
  focusedContainer: {
    width: scannerSize,
    height: scannerSize,
    backgroundColor: 'transparent',
  },
  bracket: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    padding: 20,
  },
  bottomRow: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualEntry: {
    padding: 10,
  },
  successFlash: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultCard: {
    width: '100%',
    padding: 32,
    borderRadius: 32,
    alignItems: 'center',
  },
  closeResult: {
    marginTop: 32,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
  }
});
