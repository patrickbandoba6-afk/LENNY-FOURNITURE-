import { Redirect, Tabs } from 'expo-router';

import { SplashView } from '@/components/SplashView';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useTheme } from '@/theme';

export default function TeacherLayout() {
  const guard = useRoleGuard(['TEACHER']);
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
      <Tabs.Screen name="classes" options={{ title: 'Classes' }} />
      <Tabs.Screen name="devoirs" options={{ title: 'Devoirs' }} />
      <Tabs.Screen name="notes" options={{ title: 'Notes' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
