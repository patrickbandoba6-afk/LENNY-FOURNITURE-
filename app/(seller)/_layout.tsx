import { Redirect, Tabs } from 'expo-router';

import { SplashView } from '@/components/SplashView';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useTheme } from '@/theme';

export default function SellerLayout() {
  const guard = useRoleGuard(['SELLER']);
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
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="produits" options={{ title: 'Produits' }} />
      <Tabs.Screen name="commandes" options={{ title: 'Commandes' }} />
      <Tabs.Screen name="ventes" options={{ title: 'Ventes' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
