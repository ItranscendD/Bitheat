import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  AccessibilityInfo 
} from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from './BitheatText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BitheatButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  onPress: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  style?: any;
  fullWidth?: boolean;
}

export const BitheatButton: React.FC<BitheatButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  leftIcon,
  rightIcon,
  disabled,
  loading,
  testID,
  style,
  fullWidth,
}) => {
  const { colors, spacing } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary, borderColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.blockchain, borderColor: colors.blockchain };
      case 'danger':
        return { backgroundColor: colors.alert, borderColor: colors.alert };
      case 'ghost':
        return { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 };
      case 'icon':
        return { backgroundColor: 'transparent', width: 48, height: 48, padding: 0 };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { height: 36, paddingHorizontal: spacing.sm };
      case 'md':
        return { height: 44, paddingHorizontal: spacing.md };
      case 'lg':
        return { height: 52, paddingHorizontal: spacing.lg }; // P0 48px+ requirement
      default:
        return { height: 44 };
    }
  };

  const getTextColor = () => {
    if (variant === 'ghost') return colors.text;
    if (variant === 'icon') return colors.primary;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      activeOpacity={0.7}
      style={[
        styles.base,
        getVariantStyles(),
        getSizeStyles(),
        disabled && { opacity: 0.5 },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            {label && (
              <BitheatText 
                variant={size === 'lg' ? 'bodyL' : 'body'} 
                color={getTextColor()}
                style={styles.label}
              >
                {label}
              </BitheatText>
            )}
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
