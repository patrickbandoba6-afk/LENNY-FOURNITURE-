import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/hooks/useTheme";
import type { UserRole } from "@/types";

interface TabDef {
  name: string;
  title: string;
  icon: string;
}

interface RoleTabsLayoutProps {
  allowedRoles: UserRole[];
  tabs: TabDef[];
}

export function RoleTabsLayout({ allowedRoles, tabs }: RoleTabsLayoutProps) {
  const { profile } = useAuthStore();
  const theme = useTheme();

  if (!profile) return <Redirect href="/(auth)/login" />;
  if (!allowedRoles.includes(profile.role)) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: () => <Text style={{ fontSize: 18 }}>{tab.icon}</Text>,
          }}
        />
      ))}
    </Tabs>
  );
}
