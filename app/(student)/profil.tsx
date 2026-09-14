import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { LoadingState } from '@/components/LoadingState';
import { SignOutButton } from '@/components/SignOutButton';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/theme';

export default function StudentProfile() {
  const { profile, isLoading } = useProfile();
  const { colors, spacing, typography } = useTheme();

  if (!profile && isLoading) return <LoadingState />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg }}>
        <Card style={{ gap: spacing.xs }}>
          <Text style={[typography.h3, { color: colors.text }]}>{profile?.full_name ?? '—'}</Text>
          <Text style={[typography.body, { color: colors.textMuted }]}>{profile?.email}</Text>
        </Card>
        <SignOutButton />
      </ScrollView>
    </SafeAreaView>
  );
}
