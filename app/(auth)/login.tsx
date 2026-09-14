import { useState } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Link, Redirect } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { sessionService } from "@/services/sessionService";
import { ROLE_HOME_ROUTE } from "@/constants/roles";

export default function LoginScreen() {
  const theme = useTheme();
  const { profile, setProfile, signIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (profile) {
    return <Redirect href={ROLE_HOME_ROUTE[profile.role] as any} />;
  }

  const handleSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError("Renseigne ton email et ton mot de passe.");
      return;
    }
    setLoading(true);
    const result = await signIn(email.trim(), password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    const current = await sessionService.getCurrentProfile();
    setProfile(current);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={[styles.title, { color: theme.text }]}>LENNY-FOURNITURE</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Connecte-toi pour continuer
      </Text>

      <View style={styles.form}>
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="parent@exemple.com"
        />
        <Input
          label="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />
        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}
        <Button label="Se connecter" onPress={handleSubmit} loading={loading} />
      </View>

      <Link href="/(auth)/register" style={[styles.link, { color: theme.primary }]}>
        Pas encore de compte ? Créer un compte
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: spacing.lg },
  title: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  form: { gap: spacing.sm },
  error: { fontSize: 13, marginBottom: spacing.sm },
  link: { textAlign: "center", marginTop: spacing.lg, fontWeight: "600" },
});
