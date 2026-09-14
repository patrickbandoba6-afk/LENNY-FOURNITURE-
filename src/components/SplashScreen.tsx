import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing } from "@/constants/theme";
import type { AppLifecycleState } from "@/types";

const MESSAGES: Record<AppLifecycleState, string> = {
  INITIALIZING: "Préparation de votre expérience...",
  LOADING: "Chargement...",
  READY: "Prêt",
  REFRESHING: "Mise à jour...",
  OFFLINE: "Mode hors connexion",
  ERROR: "Une erreur est survenue",
};

interface AppSplashScreenProps {
  state: AppLifecycleState;
}

export function AppSplashScreen({ state }: AppSplashScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LENNY-FOURNITURE</Text>
      <Text style={styles.slogan}>Tout pour l'enfant, en un seul endroit.</Text>
      <ActivityIndicator
        color={colors.dark.primary}
        style={styles.spinner}
      />
      <Text style={styles.message}>{MESSAGES[state]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  logo: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  slogan: {
    color: colors.dark.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  spinner: { marginBottom: spacing.md },
  message: { color: colors.dark.textMuted, fontSize: 13 },
});
