import { Text, View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";

export default function StudentProfileScreen() {
  const theme = useTheme();
  const { profile, signOut } = useAuthStore();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Profil</Text>
      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={[styles.name, { color: theme.text }]}>{profile?.fullName}</Text>
        <Text style={{ color: theme.textMuted, fontSize: 13 }}>{profile?.email}</Text>
      </Card>
      <Button label="Se déconnecter" variant="secondary" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.md },
  name: { fontSize: 16, fontWeight: "700" },
});
