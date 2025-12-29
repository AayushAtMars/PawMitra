// UI-ONLY UPDATE: Enhanced design tokens for PawMitra - Gentle Teal & Coral theme
// Fixed: Web-compatible shadows using boxShadow
// Preserves all existing token names for backward compatibility

import { Platform } from 'react-native';

export const colors = {
  // Primary brand colors - Gentle Teal
  primary: '#14B8A6', // Teal-500
  primaryDark: '#0F766E', // Teal-700
  primaryLight: '#5EEAD4', // Teal-300
  
  // Secondary colors - Coral
  secondary: '#FB7185', // Rose-400 (Coral)
  secondaryDark: '#E11D48', // Rose-600
  secondaryLight: '#FDA4AF', // Rose-300
  
  // Accent colors - Warm Orange
  accent: '#FB923C', // Orange-400
  accentDark: '#EA580C', // Orange-600
  accentLight: '#FDBA74', // Orange-300
  
  // Status colors
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  error: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500
  
  // Priority colors (matching status)
  priorityHigh: '#EF4444',
  priorityMedium: '#F59E0B',
  priorityLow: '#10B981',
  
  // Neutral colors - Warm grays
  white: '#FFFFFF',
  black: '#0F172A', // Slate-900
  gray50: '#F8FAFC', // Slate-50
  gray100: '#F1F5F9', // Slate-100
  gray200: '#E2E8F0', // Slate-200
  gray300: '#CBD5E1', // Slate-300
  gray400: '#94A3B8', // Slate-400
  gray500: '#64748B', // Slate-500
  gray600: '#475569', // Slate-600
  gray700: '#334155', // Slate-700
  gray800: '#1E293B', // Slate-800
  gray900: '#0F172A', // Slate-900
  
  // Background
  background: '#FAFAFA', // Warm off-white
  backgroundDark: '#0F172A',
  surface: '#FFFFFF',
  surfaceDark: '#1E293B',
  
  // Text
  textPrimary: '#0F172A', // Slate-900
  textSecondary: '#64748B', // Slate-500
  textDisabled: '#94A3B8', // Slate-400
  textInverse: '#FFFFFF',
  
  // Overlay
  overlay: 'rgba(15, 23, 42, 0.6)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Cross-platform shadow helper
const createShadow = (elevation, opacity, radius) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0px ${elevation}px ${radius}px rgba(15, 23, 42, ${opacity})`,
    };
  }
  return {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: elevation * 2,
  };
};

export const shadows = {
  none: Platform.OS === 'web' 
    ? { boxShadow: 'none' }
    : {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
  sm: createShadow(1, 0.08, 3),
  md: createShadow(2, 0.12, 6),
  lg: createShadow(4, 0.16, 12),
  xl: createShadow(8, 0.2, 20),
};

export const animations = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  spring: {
    default: {
      damping: 15,
      stiffness: 150,
    },
    bouncy: {
      damping: 10,
      stiffness: 200,
    },
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  animations,
};