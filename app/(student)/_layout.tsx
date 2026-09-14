import { RoleTabsLayout } from "@/components/RoleTabsLayout";

export default function StudentLayout() {
  return (
    <RoleTabsLayout
      allowedRoles={["STUDENT"]}
      tabs={[
        { name: "index", title: "Accueil", icon: "🏠" },
        { name: "cours", title: "Cours", icon: "📖" },
        { name: "devoirs", title: "Devoirs", icon: "📚" },
        { name: "assistant", title: "Assistant", icon: "✨" },
        { name: "profil", title: "Profil", icon: "👤" },
      ]}
    />
  );
}
