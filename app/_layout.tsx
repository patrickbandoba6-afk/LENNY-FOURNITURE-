import { useEffect, useState } from "react";
import { Redirect, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppSplashScreen } from "@/components/SplashScreen";
import { runStartup } from "@/services/startupService";
import { offlineService } from "@/services/offlineService";
import { supabase } from "@/services/supabase";
import { sessionService } from "@/services/sessionService";
import { useAuthStore } from "@/stores/authStore";
import type { AppLifecycleState } from "@/types";

export default function RootLayout() {
  const [lifecycle, setLifecycle] = useState<AppLifecycleState>("INITIALIZING");
  const { profile, setProfile, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const result = await runStartup();
      if (!mounted) return;
      setProfile(result.profile);
      setLifecycle(result.state);
      setLoading(false);
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setProfile(null);
          return;
        }
        const current = await sessionService.getCurrentProfile();
        setProfile(current);
      }
    );

    const unsubscribeOffline = offlineService.subscribe((online) => {
      setLifecycle((prev) => (online ? "READY" : "OFFLINE"));
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
      unsubscribeOffline();
    };
  }, []);

  if (isLoading || lifecycle === "INITIALIZING") {
    return <AppSplashScreen state={lifecycle} />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}
