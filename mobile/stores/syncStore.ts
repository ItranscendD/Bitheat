import { create } from 'zustand';
import { getDB } from '../services/db/database';

interface SyncState {
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSyncAt: string | null;
  pendingCount: number;
  failedCount: number;
  
  setSyncStatus: (status: 'idle' | 'syncing' | 'error') => void;
  setLastSyncAt: (date: string) => void;
  refreshCounts: () => Promise<void>;
}

export const useSyncStore = create<SyncState>((set) => ({
  syncStatus: 'idle',
  lastSyncAt: null,
  pendingCount: 0,
  failedCount: 0,

  setSyncStatus: (status) => set({ syncStatus: status }),
  setLastSyncAt: (date) => set({ lastSyncAt: date }),

  refreshCounts: async () => {
    try {
      const db = await getDB();
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM sync_queue WHERE retries < 5'
      );
      const failed = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM sync_queue WHERE retries >= 5'
      );
      
      set({ 
        pendingCount: result?.count || 0,
        failedCount: failed?.count || 0
      });
    } catch (error) {
      console.error('Failed to refresh sync counts:', error);
    }
  }
}));
