import { create } from 'zustand';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type ToastTone = 'neutral' | 'success' | 'danger';

interface ToastState {
  message: string | null;
  tone: ToastTone;
  show: (message: string, tone?: ToastTone) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  tone: 'neutral',
  show: (message, tone = 'neutral') => set({ message, tone }),
  hide: () => set({ message: null }),
}));

export function ToastHost() {
  const { message, tone, hide } = useToastStore();
  const { colors, radius, spacing, typography } = useTheme();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, 3000);
    return () => clearTimeout(timer);
  }, [message, hide]);

  if (!message) return null;

  const toneColors: Record<ToastTone, string> = {
    neutral: colors.surface,
    success: colors.success,
    danger: colors.danger,
  };

  return (
    <SafeAreaView style={styles.host} pointerEvents="none">
      <View
        style={[
          styles.toast,
          {
            backgroundColor: toneColors[tone],
            borderRadius: radius.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <Text style={[typography.body, { color: tone === 'neutral' ? colors.text : colors.textInverted }]}>
          {message}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    marginTop: 8,
    maxWidth: '90%',
  },
});
