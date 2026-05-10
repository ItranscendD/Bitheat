import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { useTheme } from '@/design/theme';
import { BitheatText } from '../ui/BitheatText';
import { BitheatButton } from '../ui/BitheatButton';
import { Ionicons } from '@expo/vector-icons';
import { printCard, generatePrintHTML, shareQRImage } from '@/services/qr/printService';

interface BitheatQRCodeProps {
  did: string;
  payload?: string;
  childName?: string;
  childDOB?: string;
  size?: number;
}

export const BitheatQRCode: React.FC<BitheatQRCodeProps> = ({
  did,
  payload,
  childName = 'Unknown',
  childDOB = 'Unknown',
  size = 200,
}) => {
  const { colors, spacing } = useTheme();
  const viewShotRef = useRef<any>(null);
  const qrRef = useRef<any>(null);

  const handlePrint = async () => {
    // We need the QR as a data URL for the HTML template
    qrRef.current?.toDataURL((dataURL: string) => {
      const html = generatePrintHTML(
        { name: childName, dob: childDOB, did: did } as any,
        `data:image/png;base64,${dataURL}`
      );
      printCard(html);
    });
  };

  const handleShare = async () => {
    const uri = await viewShotRef.current?.capture();
    if (uri) {
      await shareQRImage(uri, `bitheat_passport_${childName}.png`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, padding: spacing.lg }]}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={payload || did}
            size={size}
            color="black"
            backgroundColor="white"
            ecl="H" // High error correction
            getRef={(c) => (qrRef.current = c)}
          />
        </View>
      </ViewShot>

      <View style={styles.info}>
        <BitheatText variant="heading" style={styles.name}>{childName}</BitheatText>
        <BitheatText variant="body" color={colors.textSecondary}>BORN: {childDOB}</BitheatText>
      </View>

      <View style={styles.actions}>
        <BitheatButton 
          label="Print Passport" 
          onPress={handlePrint} 
          leftIcon={<Ionicons name="print-outline" size={20} color="white" />}
          style={styles.actionBtn}
        />
        <BitheatButton 
          label="Share Image" 
          variant="ghost" 
          onPress={handleShare} 
          leftIcon={<Ionicons name="share-social-outline" size={20} color={colors.primary} />}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  qrWrapper: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
  },
  info: {
    marginTop: 20,
    alignItems: 'center',
  },
  name: {
    marginBottom: 4,
  },
  actions: {
    marginTop: 24,
    width: '100%',
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
});
