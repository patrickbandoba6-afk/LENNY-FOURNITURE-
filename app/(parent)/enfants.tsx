import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";
import { useChildStore } from "@/stores/childStore";

export default function ChildrenScreen() {
  const theme = useTheme();
  const { children, activeChildId, setActiveChild } = useChildStore();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Mes enfants</Text>

      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
        ListEmptyComponent={
          <EmptyState
            title="Aucun enfant pour le moment"
            description="Ajoute un profil enfant pour accéder à son dashboard scolaire."
          />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => setActiveChild(item.id)}>
            <Card
              style={{
                borderColor:
                  item.id === activeChildId ? theme.primary : theme.border,
              }}
            >
              <Text style={[styles.name, { color: theme.text }]}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                {item.className} · {item.schoolYear}
              </Text>
            </Card>
          </Pressable>
        )}
      />

      <Button label="Ajouter un enfant" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.md },
  name: { fontSize: 16, fontWeight: "700" },
});
