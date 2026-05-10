import { Alert } from 'react-native';

/**
 * Notifies the user of sync outcomes
 */
export const syncNotifier = {
  notifySyncComplete: (count: number) => {
    console.log(`Sync complete: ${count} records anchored.`);
    // In a real app, we'd use a toast or non-blocking banner
  },

  notifySyncError: (error: string) => {
    Alert.alert('Sync Error', `There was a problem anchoring records: ${error}`);
  },

  notifySyncSkipped: (reason: string) => {
    console.log(`Sync skipped: ${reason}`);
  }
};
