import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastHost } from '@/components/Toast';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const boot = useAppStore((s) => s.boot);
  const status = useAppStore((s) => s.status);
  const { isDark } = useTheme();

  useEffect(() => {
    boot();
  }, [boot]);

  useEffect(() => {
    if (status !== 'INITIALIZING' && status !== 'LOADING') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [status]);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
      <ToastHost />
    </SafeAreaProvider>
  );
}
