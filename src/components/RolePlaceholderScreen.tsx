import { Text, View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";

interface RolePlaceholderScreenProps {
  title: string;
  description: string;
}

// Écran temporaire pour les onglets dont le contenu détaillé arrive dans une
// phase ultérieure (Phase 2+) - garde la navigation et le design cohérents
// dès la Phase 1 sans exposer de fausses données.
export function RolePlaceholderScreen({
  title,
  description,
}: RolePlaceholderScreenProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Card>
        <EmptyState title="Bientôt disponible" description={description} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.md },
});
