import { ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowBadge } from "@/components/ui/GlowBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { spacing, futuristic } from "@/constants/theme";
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

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ParentHomeScreen() {
  const theme = useTheme();
  const { profile } = useAuthStore();
  const { children, activeChild } = useChildStore();
  const child = activeChild();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.scrollContent}
    >
      <LinearGradient
        colors={[futuristic.gradientStart, futuristic.gradientMid, futuristic.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(profile?.fullName)}</Text>
          </View>
          <Pressable style={styles.bellButton}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </Pressable>
        </View>

        <Text style={styles.greeting}>
          Bonjour {profile?.fullName?.split(" ")[0] ?? ""} 👋
        </Text>
        <Text style={styles.childLine}>
          {child ? `${child.firstName} · ${child.className}` : "Aucun enfant ajouté"}
        </Text>

        <GlassCard style={styles.todayCard}>
          <Text style={styles.todayTitle}>✨ Aujourd'hui</Text>
          {child ? (
            <>
              <Text style={styles.todayItem}>• Aucun devoir urgent pour l'instant</Text>
              <Text style={styles.todayItem}>• Aucun événement prévu</Text>
            </>
          ) : (
            <Text style={styles.todayItem}>
              Ajoute un enfant pour voir apparaître ses infos ici.
            </Text>
          )}
        </GlassCard>
      </LinearGradient>

      <View style={styles.body}>
        {children.length === 0 ? (
          <EmptyState
            title="Ajoute ton premier enfant"
            description="Rendez-vous dans l'onglet Enfants pour créer un profil et débloquer son dashboard complet."
          />
        ) : (
          <View style={styles.list}>
            {DASHBOARD_SECTIONS.map((section, index) => (
              <Pressable
                key={section.key}
                style={[
                  styles.row,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <GlowBadge
                  icon={section.icon}
                  colors={futuristic.badgeColors[index % futuristic.badgeColors.length]}
                />
                <Text style={[styles.rowLabel, { color: theme.text }]}>
                  {section.label}
                </Text>
                <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: spacing.xl },
  hero: {
    paddingTop: spacing.xl + spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: futuristic.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: futuristic.gradientStart, fontWeight: "800", fontSize: 15 },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: futuristic.glass,
    borderWidth: 1,
    borderColor: futuristic.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    color: futuristic.textOnDark,
    fontSize: 26,
    fontWeight: "800",
  },
  childLine: {
    color: futuristic.textOnDarkMuted,
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  todayCard: {},
  todayTitle: {
    color: futuristic.gold,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  todayItem: {
    color: futuristic.textOnDark,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  body: { padding: spacing.lg, paddingTop: spacing.lg },
  list: { gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.md,
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "700" },
  chevron: { fontSize: 22, fontWeight: "300" },
});
