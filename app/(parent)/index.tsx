import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { useChildStore } from "@/stores/childStore";

const DASHBOARD_SECTIONS = [
  { key: "devoirs", label: "Devoirs", icon: "📚" },
  { key: "notes", label: "Notes", icon: "📝" },
  { key: "emploi_du_temps", label: "Emploi du temps", icon: "🗓️" },
  { key: "ecole", label: "École", icon: "🏫" },
  { key: "transport", label: "Transport", icon: "🚌" },
  { key: "cantine", label: "Cantine", icon: "🍽️" },
  { key: "boutique", label: "Boutique", icon: "🛒" },
  { key: "activites", label: "Activités", icon: "⚽" },
  { key: "documents", label: "Documents", icon: "📄" },
];

export default function ParentHomeScreen() {
  const theme = useTheme();
  const { profile } = useAuthStore();
  const { children, activeChild } = useChildStore();
  const child = activeChild();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.greeting, { color: theme.text }]}>
        Bonjour {profile?.fullName?.split(" ")[0] ?? ""}
      </Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        {child ? `Enfant actif : ${child.firstName}` : "Aucun enfant ajouté"}
      </Text>

      {children.length === 0 ? (
        <Card style={{ marginTop: spacing.lg }}>
          <EmptyState
            title="Ajoute ton premier enfant"
            description="Rendez-vous dans l'onglet Enfants pour créer un profil et voir apparaître son dashboard ici."
          />
        </Card>
      ) : (
        <View style={styles.grid}>
          {DASHBOARD_SECTIONS.map((section) => (
            <Card key={section.key} style={styles.tile}>
              <Text style={styles.tileIcon}>{section.icon}</Text>
              <Text style={[styles.tileLabel, { color: theme.text }]}>
                {section.label}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  greeting: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tile: {
    width: "47%",
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  tileIcon: { fontSize: 28, marginBottom: spacing.xs },
  tileLabel: { fontSize: 13, fontWeight: "600" },
});
