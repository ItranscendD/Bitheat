import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { useAuthStore } from '@/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function SetPinScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { setPin } = useAuthStore();
  
  const [currentPin, setCurrentPin] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [firstPin, setFirstPin] = useState('');

  const handlePress = (num: string) => {
    if (currentPin.length < 4) {
      const newPin = currentPin + num;
      setCurrentPin(newPin);
      
      if (newPin.length === 4) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => handlePinComplete(newPin), 300);
      }
    }
  };

  const handleBackspace = () => {
    setCurrentPin(currentPin.slice(0, -1));
  };

  const handlePinComplete = (pin: string) => {
    if (!confirming) {
      setFirstPin(pin);
      setConfirming(true);
      setCurrentPin('');
    } else {
      if (pin === firstPin) {
        setPin(pin);
        router.push('/(auth)/generating-did');
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        alert("PINs don't match. Try again.");
        setCurrentPin('');
        setConfirming(false);
        setFirstPin('');
      }
    }
  };

  const renderDot = (index: number) => {
    const active = currentPin.length > index;
    return (
      <View 
        key={index} 
        style={[
          styles.pinDot, 
          { backgroundColor: active ? colors.primary : colors.surface }
        ]} 
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
        </View>

        <BitheatText variant="heading" style={styles.title}>
          {confirming ? 'Confirm your PIN' : 'Set your security PIN'}
        </BitheatText>
        
        <View style={styles.dotsContainer}>
          {[0, 1, 2, 3].map(renderDot)}
        </View>

        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity 
              key={num} 
              style={[styles.key, { backgroundColor: colors.surface }]} 
              onPress={() => handlePress(num.toString())}
            >
              <BitheatText variant="heading" style={styles.keyText}>{num}</BitheatText>
            </TouchableOpacity>
          ))}
          <View style={styles.keySpacer} />
          <TouchableOpacity 
            style={[styles.key, { backgroundColor: colors.surface }]} 
            onPress={() => handlePress('0')}
          >
            <BitheatText variant="heading" style={styles.keyText}>0</BitheatText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.key} 
            onPress={handleBackspace}
          >
            <Ionicons name="backspace-outline" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 24,
  },
  keySpacer: {
    width: 80,
  }
});
