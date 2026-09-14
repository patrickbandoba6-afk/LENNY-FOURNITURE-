import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { useTheme } from '@/theme';

interface ScreenHeaderProps {
  greetingName: string;
  roleLabel: string;
  avatarUrl?: string | null;
}

export function ScreenHeader({ greetingName, roleLabel, avatarUrl }: ScreenHeaderProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.md }]}>
      <Avatar uri={avatarUrl} name={greetingName} size={52} />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={[typography.h2, { color: colors.text }]}>Bonjour, {greetingName} 👋</Text>
        <Badge label={roleLabel} tone="info" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
