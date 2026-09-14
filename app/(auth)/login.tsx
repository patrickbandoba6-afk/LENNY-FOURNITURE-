import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Link, Redirect } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { spacing, radius } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { sessionService } from "@/services/sessionService";
import { ROLE_HOME_ROUTE } from "@/constants/roles";
import type { UserRole } from "@/types";

const GUEST_ROLES: { value: UserRole; label: string; icon: string }[] = [
  { value: "PARENT", label: "Parent", icon: "🏠" },
  { value: "STUDENT", label: "Élève", icon: "🎒" },
  { value: "TEACHER", label: "Enseignant", icon: "🏫" },
  { value: "SELLER", label: "Vendeur", icon: "🛒" },
  { value: "ADMIN", label: "Admin", icon: "⚙️" },
];

export default function LoginScreen() {
  const theme = useTheme();
  const { profile, setProfile, signIn, enterGuestMode } = useAuthStore();
  const [showRealLogin, setShowRealLogin] = useState(false);
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
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>LENNY-FOURNITURE</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Mode démo - explore la navigation et les fonctionnalités par rôle,
          sans compte.
        </Text>

        <View style={styles.roleGrid}>
          {GUEST_ROLES.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => enterGuestMode(r.value)}
              style={[
                styles.roleCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <Text style={[styles.roleLabel, { color: theme.text }]}>{r.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setShowRealLogin((v) => !v)} style={styles.toggle}>
          <Text style={{ color: theme.primary, fontWeight: "600" }}>
            {showRealLogin ? "Masquer la connexion réelle" : "J'ai déjà un vrai compte"}
          </Text>
        </Pressable>

        {showRealLogin ? (
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
            <Link
              href="/(auth)/register"
              style={[styles.link, { color: theme.primary }]}
            >
              Pas encore de compte ? Créer un compte
            </Link>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  title: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  roleCard: {
    width: "28%",
    minWidth: 90,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  roleIcon: { fontSize: 26, marginBottom: spacing.xs },
  roleLabel: { fontSize: 13, fontWeight: "700" },
  toggle: { alignItems: "center", marginBottom: spacing.md },
  form: { gap: spacing.sm, marginTop: spacing.sm },
  error: { fontSize: 13, marginBottom: spacing.sm },
  link: { textAlign: "center", marginTop: spacing.lg, fontWeight: "600" },
});
