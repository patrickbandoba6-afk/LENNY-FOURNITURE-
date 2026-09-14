import { Text, View, Image, StyleSheet, ActivityIndicator } from "react-native";
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
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator color={colors.light.primary} style={styles.spinner} />
      <Text style={styles.message}>{MESSAGES[state]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: spacing.lg,
  },
  spinner: { marginBottom: spacing.md },
  message: { color: colors.light.textMuted, fontSize: 13 },
});
