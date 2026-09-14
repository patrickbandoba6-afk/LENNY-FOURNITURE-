import * as Network from "expo-network";

export type ConnectivityListener = (isOnline: boolean) => void;

let listeners: ConnectivityListener[] = [];
let pollHandle: ReturnType<typeof setInterval> | null = null;
let lastKnownState: boolean | null = null;

async function checkOnce(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state.isConnected && state.isInternetReachable !== false);
  } catch {
    return true;
  }
}

export const offlineService = {
  async isOnline(): Promise<boolean> {
    return checkOnce();
  },

  // Pas de vrai listener réseau natif ici (dépend d'expo-network) : on fait
  // un polling léger, suffisant pour la Phase 1 et remplaçable plus tard.
  subscribe(listener: ConnectivityListener): () => void {
    listeners.push(listener);

    if (!pollHandle) {
      pollHandle = setInterval(async () => {
        const online = await checkOnce();
        if (online !== lastKnownState) {
          lastKnownState = online;
          listeners.forEach((l) => l(online));
        }
      }, 5000);
    }

    return () => {
      listeners = listeners.filter((l) => l !== listener);
      if (listeners.length === 0 && pollHandle) {
        clearInterval(pollHandle);
        pollHandle = null;
      }
    };
  },
};
