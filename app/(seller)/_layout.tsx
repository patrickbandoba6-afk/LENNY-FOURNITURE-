import { RoleTabsLayout } from "@/components/RoleTabsLayout";

export default function SellerLayout() {
  return (
    <RoleTabsLayout
      allowedRoles={["SELLER", "DELIVERY_AGENT"]}
      tabs={[
        { name: "index", title: "Dashboard", icon: "📊" },
        { name: "produits", title: "Produits", icon: "📦" },
        { name: "commandes", title: "Commandes", icon: "🧾" },
        { name: "ventes", title: "Ventes", icon: "💰" },
        { name: "profil", title: "Profil", icon: "👤" },
      ]}
    />
  );
}
