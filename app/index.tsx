import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { ROLE_HOME_ROUTE } from "@/constants/roles";

export default function Index() {
  const { profile } = useAuthStore();

  if (!profile) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={ROLE_HOME_ROUTE[profile.role] as any} />;
}
