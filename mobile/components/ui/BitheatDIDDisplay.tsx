import React from 'react';
import { View, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from './BitheatText';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface BitheatDIDDisplayProps {
  did: string;
  showFullOnLongPress?: boolean;
}

export const BitheatDIDDisplay: React.FC<BitheatDIDDisplayProps> = ({
  did,
  showFullOnLongPress = true,
}) => {
  const { colors, spacing } = useTheme();

  const truncatedDID = did.length > 20 
    ? `${did.slice(0, 12)}...${did.slice(-6)}`
    : did;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(did);
  };

  const handleLongPress = () => {
    if (showFullOnLongPress) {
      alert(`Full DID:\n${did}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity 
        style={styles.textContainer} 
        onLongPress={handleLongPress}
        activeOpacity={0.7}
      >
        <BitheatText variant="mono" color={colors.textSecondary}>
          {truncatedDID}
        </BitheatText>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
        <Ionicons name="copy-outline" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingLeft: 12,
    height: 44,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  copyButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
