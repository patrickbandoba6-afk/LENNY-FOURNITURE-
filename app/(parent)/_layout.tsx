import { Redirect, Tabs } from 'expo-router';

import { SplashView } from '@/components/SplashView';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useTheme } from '@/theme';

export default function ParentLayout() {
  const guard = useRoleGuard(['PARENT']);
  const { colors } = useTheme();

  if (guard.state === 'LOADING') return <SplashView message="Préparation de votre expérience..." />;
  if (guard.state === 'UNAUTHENTICATED') return <Redirect href="/(auth)/login" />;
  if (guard.state === 'WRONG_ROLE') return <Redirect href={guard.redirectTo as never} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="enfants" options={{ title: 'Enfants' }} />
      <Tabs.Screen name="ecole" options={{ title: 'École' }} />
      <Tabs.Screen name="boutique" options={{ title: 'Boutique' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
