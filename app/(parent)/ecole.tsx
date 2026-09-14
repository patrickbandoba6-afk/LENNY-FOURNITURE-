import { ScrollView, Text, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";
import { useChildStore } from "@/stores/childStore";

export default function SchoolScreen() {
  const theme = useTheme();
  const child = useChildStore((s) => s.activeChild());

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: theme.text }]}>École</Text>

      {!child ? (
        <Card>
          <EmptyState title="Sélectionne un enfant pour voir son école" />
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: spacing.md }}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Emploi du temps</Text>
            <EmptyState title="Aucun cours planifié" description="Synchronisé avec l'école dès qu'elle publie l'emploi du temps." />
          </Card>
          <Card style={{ marginBottom: spacing.md }}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Devoirs</Text>
            <EmptyState title="Aucun devoir en cours" />
          </Card>
          <Card>
            <Text style={[styles.label, { color: theme.textMuted }]}>Notes et bulletins</Text>
            <EmptyState title="Aucune note disponible" />
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: "700", marginBottom: spacing.sm, textTransform: "uppercase" },
});
