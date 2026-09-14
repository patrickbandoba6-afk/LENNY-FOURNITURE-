import { RoleTabsLayout } from "@/components/RoleTabsLayout";

export default function AdminLayout() {
  return (
    <RoleTabsLayout
      allowedRoles={["SUPER_ADMIN", "ADMIN", "SCHOOL_ADMIN"]}
      tabs={[
        { name: "index", title: "Dashboard", icon: "📊" },
        { name: "utilisateurs", title: "Utilisateurs", icon: "👥" },
        { name: "profil", title: "Profil", icon: "👤" },
      ]}
    />
  );
}
