import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  label: string;
  tone?: Tone;
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const { colors, radius, spacing, typography } = useTheme();

  const toneColors: Record<Tone, { bg: string; fg: string }> = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
    success: { bg: `${colors.success}22`, fg: colors.success },
    warning: { bg: `${colors.warning}22`, fg: colors.warning },
    danger: { bg: `${colors.danger}22`, fg: colors.danger },
    info: { bg: `${colors.info}22`, fg: colors.info },
  };

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: toneColors[tone].bg,
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs,
        },
      ]}
    >
      <Text style={[typography.label, { color: toneColors[tone].fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
});
