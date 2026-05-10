import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from './BitheatText';
import { Ionicons } from '@expo/vector-icons';

export type BadgeVariant = 'offline' | 'syncing' | 'online' | 'anchored' | 'zkp' | 'alert';

interface BitheatBadgeProps {
  variant: BadgeVariant;
  text?: string;
  size?: 'sm' | 'md';
}

export const BitheatBadge: React.FC<BitheatBadgeProps> = ({
  variant,
  text,
  size = 'md',
}) => {
  const { colors, spacing } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === 'syncing') {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [variant]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getVariantConfig = () => {
    switch (variant) {
      case 'offline':
        return { color: colors.textSecondary, icon: 'cloud-offline', label: 'Offline' };
      case 'syncing':
        return { color: colors.primary, icon: 'sync', label: 'Syncing' };
      case 'online':
        return { color: colors.primary, icon: 'cloud-done', label: 'Online' };
      case 'anchored':
        return { color: colors.blockchain, icon: 'link', label: 'Anchored' };
      case 'zkp':
        return { color: colors.blockchain, icon: 'shield-checkmark', label: 'ZKP Proof' };
      case 'alert':
        return { color: colors.alert, icon: 'alert-circle', label: 'Alert' };
    }
  };

  const config = getVariantConfig();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: `${config.color}20`,
        borderColor: config.color,
        paddingHorizontal: size === 'sm' ? spacing.xs : spacing.sm,
        paddingVertical: size === 'sm' ? 2 : spacing.xs,
      }
    ]}>
      <Animated.View style={variant === 'syncing' ? { transform: [{ rotate: rotation }] } : {}}>
        <Ionicons 
          name={config.icon as any} 
          size={size === 'sm' ? 12 : 16} 
          color={config.color} 
        />
      </Animated.View>
      <BitheatText 
        variant="caption" 
        color={config.color} 
        style={[styles.text, { marginLeft: spacing.xs }]}
      >
        {text || config.label}
      </BitheatText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
