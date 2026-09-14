import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.base, { backgroundColor: colors.background, gap: spacing.md }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={[typography.body, { color: colors.textMuted }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
