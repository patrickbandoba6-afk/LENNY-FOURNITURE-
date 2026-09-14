import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SkeletonList } from '@/components/SkeletonLoader';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/theme';

export default function ParentHome() {
  const { profile, isLoading } = useProfile();
  const { colors, spacing } = useTheme();

  if (!profile && isLoading) return <LoadingState />;
  if (!profile) return <EmptyState title="Profil indisponible" description="Vérifiez votre connexion." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader greetingName={profile.full_name ?? 'Parent'} roleLabel="Parent" avatarUrl={profile.avatar_url} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg }}>
        <Card>
          <EmptyState
            title="Aucun enfant enregistré pour l'instant"
            description="Ajoutez un enfant depuis l'onglet Enfants pour suivre sa scolarité."
          />
        </Card>
        {isLoading ? <SkeletonList rows={2} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
