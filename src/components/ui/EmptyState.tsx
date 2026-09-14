import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/constants/theme";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: theme.textMuted }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: spacing.xl },
  title: { fontSize: 16, fontWeight: "600", marginBottom: spacing.xs },
  description: { fontSize: 14, textAlign: "center" },
});
