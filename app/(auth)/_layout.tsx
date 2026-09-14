import { Redirect, Stack } from 'expo-router';

import { useAppStore } from '@/store/appStore';

export default function AuthLayout() {
  const userId = useAppStore((s) => s.userId);
  const role = useAppStore((s) => s.role);

  if (userId && role) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
