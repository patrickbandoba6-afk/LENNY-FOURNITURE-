import { Redirect } from 'expo-router';

import { ErrorState } from '@/components/ErrorState';
import { SplashView } from '@/components/SplashView';
import { useAppStore } from '@/store/appStore';
import { ROLE_HOME_ROUTE } from '@/types/roles';

export default function Index() {
  const status = useAppStore((s) => s.status);
  const role = useAppStore((s) => s.role);
  const userId = useAppStore((s) => s.userId);
  const errorMessage = useAppStore((s) => s.errorMessage);
  const boot = useAppStore((s) => s.boot);

  if (status === 'INITIALIZING' || status === 'LOADING') {
    return <SplashView message="Préparation de votre expérience..." />;
  }

  if (status === 'ERROR') {
    return (
      <ErrorState
        title="Impossible de charger votre espace."
        description={errorMessage ?? undefined}
        onRetry={boot}
        retryLabel="Réessayer"
      />
    );
  }

  if (!userId || !role) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={ROLE_HOME_ROUTE[role] as never} />;
}
