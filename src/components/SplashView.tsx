import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/theme/colors';

interface SplashViewProps {
  message: string;
}

/**
 * Custom premium splash shown while the app boots (Supabase init, session
 * check, profile/permissions load). Duration is driven entirely by real
 * initialization work — no artificial delay is added here.
 */
export function SplashView({ message }: SplashViewProps) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
    ]).start();

    const loop = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false })
    );
    loop.start();
    return () => loop.stop();
  }, [fade, scale, progress]);

  const barWidth = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['10%', '80%', '10%'] });

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }], alignItems: 'center' }}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S1</Text>
        </View>
        <Text style={styles.title}>SCHOOLONE</Text>
        <Text style={styles.slogan}>Tout pour l'enfant, en un seul endroit.</Text>
      </Animated.View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { width: barWidth }]} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.neutral900,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 32,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: palette.primary500,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: palette.neutral0,
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    color: palette.neutral0,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  slogan: {
    color: palette.neutral400,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  progressTrack: {
    width: 160,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.neutral800,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.primary500,
  },
  message: {
    color: palette.neutral400,
    fontSize: 13,
  },
});
