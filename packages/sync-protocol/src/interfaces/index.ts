export interface SyncRecord {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  retryCount: number;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  txHash?: string;
}

/**
 * Interface for the target storage layer (e.g., Celo, IPFS, REST API)
 */
export interface ISyncAdapter {
  name: string;
  storeRecord(record: SyncRecord): Promise<SyncResult>;
}

/**
 * Interface for the local offline queue storage (e.g., SQLite, IndexedDB)
 */
export interface IQueueStorage {
  enqueue(record: Omit<SyncRecord, 'retryCount'>): Promise<void>;
  getNextBatch(limit: number): Promise<SyncRecord[]>;
  markComplete(id: string): Promise<void>;
  markFailed(id: string, error: string): Promise<void>;
  getPendingCount(): Promise<number>;
}

/**
 * Connectivity levels supported by the protocol
 */
export type ConnectivityType = 'none' | '2g' | '3g' | '4g' | 'wifi';

export interface IConnectivityMonitor {
  getConnectivity(): Promise<ConnectivityType>;
  subscribe(callback: (type: ConnectivityType) => void): void;
}
