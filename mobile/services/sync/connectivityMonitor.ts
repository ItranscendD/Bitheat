import * as Network from 'expo-network';

export type ConnectionType = 'none' | '2g' | '3g' | '4g' | 'wifi' | 'unknown';

/**
 * Returns the current connection type
 */
export const getConnectionType = async (): Promise<ConnectionType> => {
  const state = await Network.getNetworkStateAsync();
  
  if (!state.isConnected || !state.isInternetReachable) return 'none';
  
  switch (state.type) {
    case Network.NetworkStateType.WIFI:
      return 'wifi';
    case Network.NetworkStateType.CELLULAR:
      // Simplified mapping as expo-network doesn't always give 3G/4G explicitly easily
      // but we can assume cellular is at least 3G for this purpose
      return '4g';
    default:
      return 'unknown';
  }
};

/**
 * Returns true if the connection is suitable for syncing
 */
export const isSyncReady = async (): Promise<boolean> => {
  const type = await getConnectionType();
  return type === 'wifi' || type === '4g'; // 3G equivalent or better
};
