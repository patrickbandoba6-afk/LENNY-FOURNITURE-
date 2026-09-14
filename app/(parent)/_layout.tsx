import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/hooks/useTheme";

function TabIcon({ symbol }: { symbol: string }) {
  return <Text style={{ fontSize: 18 }}>{symbol}</Text>;
}

export default function ParentLayout() {
  const { profile } = useAuthStore();
  const theme = useTheme();

  if (!profile) return <Redirect href="/(auth)/login" />;
  if (profile.role !== "PARENT") return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Accueil", tabBarIcon: () => <TabIcon symbol="🏠" /> }}
      />
      <Tabs.Screen
        name="enfants"
        options={{ title: "Enfants", tabBarIcon: () => <TabIcon symbol="🧒" /> }}
      />
      <Tabs.Screen
        name="ecole"
        options={{ title: "École", tabBarIcon: () => <TabIcon symbol="🏫" /> }}
      />
      <Tabs.Screen
        name="boutique"
        options={{ title: "Boutique", tabBarIcon: () => <TabIcon symbol="🛒" /> }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: "Profil", tabBarIcon: () => <TabIcon symbol="👤" /> }}
      />
    </Tabs>
  );
}
