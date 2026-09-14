import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { useTheme } from '@/theme';

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Réessayer',
  onSecondaryAction,
  secondaryLabel,
}: ErrorStateProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.base, { backgroundColor: colors.background, padding: spacing.xl, gap: spacing.md }]}>
      <Text style={[typography.h3, { color: colors.text, textAlign: 'center' }]}>{title}</Text>
      {description ? (
        <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>{description}</Text>
      ) : null}
      <View style={{ gap: spacing.sm, width: '100%', marginTop: spacing.md }}>
        {onRetry ? <Button label={retryLabel} onPress={onRetry} /> : null}
        {onSecondaryAction && secondaryLabel ? (
          <Button label={secondaryLabel} variant="outline" onPress={onSecondaryAction} />
        ) : null}
      </View>
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
