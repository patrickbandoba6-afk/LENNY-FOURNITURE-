import { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Link, Redirect } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { spacing, radius } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from "@/types";

const SIGNUP_ROLES: { value: UserRole; label: string }[] = [
  { value: "PARENT", label: "Parent" },
  { value: "STUDENT", label: "Élève" },
  { value: "TEACHER", label: "Enseignant" },
  { value: "SELLER", label: "Vendeur" },
];

export default function RegisterScreen() {
  const theme = useTheme();
  const { profile, signUp } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("PARENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (profile) {
    return <Redirect href="/" />;
  }

  const handleSubmit = async () => {
    setError(null);
    if (!fullName || !email || !password) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    const result = await signUp({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      role,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Compte créé
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Vérifie ta boîte mail pour confirmer ton compte, puis connecte-toi.
        </Text>
        <Link href="/(auth)/login" style={[styles.link, { color: theme.primary }]}>
          Retour à la connexion
        </Link>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Créer un compte</Text>

      <View style={styles.roleRow}>
        {SIGNUP_ROLES.map((r) => (
          <Pressable
            key={r.value}
            onPress={() => setRole(r.value)}
            style={[
              styles.roleChip,
              {
                borderColor: role === r.value ? theme.primary : theme.border,
                backgroundColor: role === r.value ? theme.primary : theme.surface,
              },
            ]}
          >
            <Text
              style={{
                color: role === r.value ? theme.primaryText : theme.text,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.form}>
        <Input label="Nom complet" value={fullName} onChangeText={setFullName} />
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}
        <Button label="Créer mon compte" onPress={handleSubmit} loading={loading} />
      </View>

      <Link href="/(auth)/login" style={[styles.link, { color: theme.primary }]}>
        Déjà un compte ? Se connecter
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: spacing.lg },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
    justifyContent: "center",
  },
  roleChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  form: { gap: spacing.sm },
  error: { fontSize: 13, marginBottom: spacing.sm },
  link: { textAlign: "center", marginTop: spacing.lg, fontWeight: "600" },
});
