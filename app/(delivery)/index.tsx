import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/theme';

export default function DeliveryHome() {
  const { profile, isLoading } = useProfile();
  const { colors, spacing } = useTheme();

  if (!profile && isLoading) return <LoadingState />;
  if (!profile) return <EmptyState title="Profil indisponible" description="Vérifiez votre connexion." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader greetingName={profile.full_name ?? 'Livreur'} roleLabel="Livreur" avatarUrl={profile.avatar_url} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg }}>
        <Card>
          <EmptyState title="Aucune livraison assignée" description="Vos livraisons du jour s'afficheront ici — Phase 7." />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
