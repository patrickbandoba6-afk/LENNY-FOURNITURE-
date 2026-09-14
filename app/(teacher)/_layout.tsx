import { RoleTabsLayout } from "@/components/RoleTabsLayout";

export default function TeacherLayout() {
  return (
    <RoleTabsLayout
      allowedRoles={["TEACHER"]}
      tabs={[
        { name: "index", title: "Accueil", icon: "🏠" },
        { name: "classes", title: "Classes", icon: "🏫" },
        { name: "devoirs", title: "Devoirs", icon: "📚" },
        { name: "notes", title: "Notes", icon: "📝" },
        { name: "profil", title: "Profil", icon: "👤" },
      ]}
    />
  );
}
