import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/theme';

const SECTIONS = ['Utilisateurs', 'Écoles', 'Produits', 'Commandes', 'Paiements', 'Contenus', 'Paramètres', 'Logs'];

export default function AdminDashboard() {
  const { profile, isLoading } = useProfile();
  const { colors, spacing, radius, typography } = useTheme();

  if (!profile && isLoading) return <LoadingState />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        greetingName={profile?.full_name ?? 'Administrateur'}
        roleLabel={profile?.role === 'SUPER_ADMIN' ? 'Super administrateur' : 'Administrateur'}
        avatarUrl={profile?.avatar_url}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
        {SECTIONS.map((section) => (
          <Card key={section} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[typography.bodyStrong, { color: colors.text }]}>{section}</Text>
            <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 }}>
              <Text style={[typography.label, { color: colors.textMuted }]}>Phase 8</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
