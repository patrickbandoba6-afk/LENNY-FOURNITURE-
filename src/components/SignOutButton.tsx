import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

export function SignOutButton() {
  const signOut = useAuthStore((s) => s.signOut);
  return <Button label="Se déconnecter" variant="outline" onPress={signOut} />;
}
