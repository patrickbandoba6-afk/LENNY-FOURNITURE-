import { useColorScheme } from 'react-native';

import { darkColors, lightColors } from './colors';
import { radius, spacing } from './spacing';
import { typography } from './typography';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    typography,
  };
}

export type Theme = ReturnType<typeof useTheme>;
