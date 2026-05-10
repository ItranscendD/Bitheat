import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from './BitheatText';

interface BitheatInputProps extends TextInputProps {
  label?: string;
  fieldMode?: boolean;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const BitheatInput: React.FC<BitheatInputProps> = ({
  label,
  fieldMode = false,
  hint,
  error,
  style,
  leftIcon,
  ...props
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <BitheatText variant="caption" color={colors.textSecondary} style={styles.label}>
          {label}
        </BitheatText>
      )}
      <View
        style={[
          styles.inputWrapper,
          { 
            backgroundColor: colors.surface, 
            borderColor: error ? colors.alert : colors.border,
            height: fieldMode ? 52 : 44, // 52px for fieldMode touch target
          }
        ]}
      >
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              fontSize: typography.sizes.body,
              fontFamily: typography.families.body,
            },
            style
          ]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
      </View>
      {(error || hint) && (
        <BitheatText 
          variant="caption" 
          color={error ? colors.alert : colors.textSecondary} 
          style={styles.hint}
        >
          {error || hint}
        </BitheatText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  hint: {
    marginTop: 4,
  },
});
