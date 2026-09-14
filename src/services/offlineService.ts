import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export type ConnectivityStatus = 'ONLINE' | 'OFFLINE' | 'UNKNOWN';

function toStatus(state: NetInfoState): ConnectivityStatus {
  if (state.isConnected == null) return 'UNKNOWN';
  return state.isConnected && state.isInternetReachable !== false ? 'ONLINE' : 'OFFLINE';
}

async function getStatus(): Promise<ConnectivityStatus> {
  const state = await NetInfo.fetch();
  return toStatus(state);
}

function subscribe(onChange: (status: ConnectivityStatus) => void): () => void {
  return NetInfo.addEventListener((state) => onChange(toStatus(state)));
}

/** Resolves once the device is back online (used to trigger a sync on reconnect). */
function onReconnect(callback: () => void): () => void {
  let wasOffline = false;
  return subscribe((status) => {
    if (status === 'OFFLINE') {
      wasOffline = true;
    } else if (status === 'ONLINE' && wasOffline) {
      wasOffline = false;
      callback();
    }
  });
}

export const offlineService = { getStatus, subscribe, onReconnect };
