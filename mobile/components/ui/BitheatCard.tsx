import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/design/theme';
import { BitheatText } from './BitheatText';

export type CardVariant = 'action' | 'data' | 'status';

interface BitheatCardProps {
  variant?: CardVariant;
  title: string;
  subtitle?: string;
  body?: string;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  statusColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const BitheatCard: React.FC<BitheatCardProps> = ({
  variant = 'data',
  title,
  subtitle,
  body,
  footer,
  icon,
  statusColor,
  onPress,
  style,
  children,
}) => {
  const { colors, spacing } = useTheme();

  const Container = onPress ? TouchableOpacity : View;

  const renderContent = () => {
    switch (variant) {
      case 'action':
        return (
          <View style={styles.actionRow}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <View style={styles.titleContainer}>
              <BitheatText variant="heading">{title}</BitheatText>
              {subtitle && <BitheatText variant="body" color={colors.textSecondary}>{subtitle}</BitheatText>}
            </View>
          </View>
        );
      case 'data':
        return (
          <View>
            <BitheatText variant="caption" color={colors.primary} style={styles.label}>{subtitle || 'RECORD'}</BitheatText>
            <BitheatText variant="heading" style={styles.dataTitle}>{title}</BitheatText>
            {body && <BitheatText variant="body" style={styles.body}>{body}</BitheatText>}
          </View>
        );
      case 'status':
        return (
          <View style={styles.statusRow}>
            <View style={[styles.statusAccent, { backgroundColor: statusColor || colors.primary }]} />
            <View style={styles.titleContainer}>
              <BitheatText variant="heading">{title}</BitheatText>
              {body && <BitheatText variant="body" color={colors.textSecondary}>{body}</BitheatText>}
            </View>
          </View>
        );
    }
  };

  return (
    <Container 
      onPress={onPress}
      style={[
        styles.card, 
        { backgroundColor: colors.surface, padding: spacing.md },
        style
      ]}
    >
      {children || renderContent()}
      {footer && <View style={styles.footer}>{footer}</View>}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusAccent: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  iconContainer: {
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dataTitle: {
    marginBottom: 8,
  },
  body: {
    marginTop: 4,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#30363D20',
    paddingTop: 12,
  },
});
