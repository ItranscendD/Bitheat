import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/design/theme';

type TypeVariant = 'displayXL' | 'displayL' | 'heading' | 'bodyL' | 'body' | 'caption' | 'mono';

interface BitheatTextProps extends TextProps {
  variant?: TypeVariant;
  color?: string;
}

export const BitheatText: React.FC<BitheatTextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const { typography, colors } = useTheme();

  const getVariantStyle = () => {
    const { families, sizes, lineHeights } = typography;
    switch (variant) {
      case 'displayXL':
        return { fontFamily: families.display, fontSize: sizes.displayXL, lineHeight: lineHeights.displayXL };
      case 'displayL':
        return { fontFamily: families.display, fontSize: sizes.displayL, lineHeight: lineHeights.displayL };
      case 'heading':
        return { fontFamily: families.heading, fontSize: sizes.heading, lineHeight: lineHeights.heading };
      case 'bodyL':
        return { fontFamily: families.body, fontSize: sizes.bodyL, lineHeight: lineHeights.bodyL };
      case 'body':
        return { fontFamily: families.body, fontSize: sizes.body, lineHeight: lineHeights.body };
      case 'caption':
        return { fontFamily: families.body, fontSize: sizes.caption, lineHeight: lineHeights.caption };
      case 'mono':
        return { fontFamily: families.mono, fontSize: sizes.mono, lineHeight: lineHeights.mono };
      default:
        return { fontFamily: families.body, fontSize: sizes.body, lineHeight: lineHeights.body };
    }
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        { color: color || colors.text },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
