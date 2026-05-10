import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from './tokens';

export type Theme = {
  colors: typeof COLORS.dark & {
    primary: string;
    blockchain: string;
    warning: string;
    alert: string;
    danger: string;
    success: string;
    info: string;
  };
  typography: typeof TYPOGRAPHY;
  spacing: typeof SPACING;
  isDark: boolean;
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme: Theme = {
    colors: {
      ...(isDark ? COLORS.dark : COLORS.light),
      primary: COLORS.primary,
      blockchain: COLORS.blockchain,
      warning: COLORS.warning,
      alert: COLORS.alert,
      danger: COLORS.danger,
      success: COLORS.success,
      info: COLORS.info,
    },
    typography: TYPOGRAPHY,
    spacing: SPACING,
    isDark,
  };

  return React.createElement(ThemeContext.Provider, { value: theme }, children);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
