/**
 * Bitheat Design Tokens
 * Strictly following the Bitheat Skill requirements.
 */

export const COLORS = {
  primary: '#0CCE8B', // Bitheat Emerald
  blockchain: '#6D28D9', // Bitheat Indigo
  warning: '#F59E0B', // Amber
  alert: '#EF4444', // Red
  danger: '#EF4444',
  success: '#10B981',
  info: '#3B82F6',
  dark: {
    background: '#0D1117',
    surface: '#161B22',
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    border: '#30363D',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F6F8FA',
    text: '#1F2328',
    textSecondary: '#656D76',
    border: '#D0D7DE',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  families: {
    display: 'SpaceGrotesk_700Bold',
    heading: 'SpaceGrotesk_500Medium',
    body: 'DMSans_400Regular',
    mono: 'SpaceMono_400Regular',
  },
  sizes: {
    displayXL: 40,
    displayL: 32,
    heading: 24,
    bodyL: 18,
    body: 16,
    caption: 14,
    mono: 14,
  },
  lineHeights: {
    displayXL: 48,
    displayL: 40,
    heading: 32,
    bodyL: 28,
    body: 24,
    caption: 20,
    mono: 20,
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};
