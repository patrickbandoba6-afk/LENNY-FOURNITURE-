import { ScrollView, Text, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";

export default function ShopScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: theme.text }]}>Boutique</Text>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Préparer ma rentrée
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: spacing.md }}>
          Fournitures, livres, uniforme, informatique et activités en un seul panier.
        </Text>
        <Button label="Commencer" onPress={() => {}} />
      </Card>

      <Card>
        <EmptyState
          title="Marketplace bientôt disponible"
          description="Produits, vendeurs et listes de fournitures arrivent en Phase 3 et 4."
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.md },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: spacing.xs },
});
