import { 
  ISyncAdapter, 
  IQueueStorage, 
  IConnectivityMonitor, 
  ConnectivityType 
} from '../interfaces';

export interface SyncConfig {
  batchSize: number;
  maxRetries: number;
  minConnectivity: ConnectivityType;
}

/**
 * The core orchestration engine for the Bitheat Sync Protocol
 */
export class SyncEngine {
  private isSyncing = false;

  constructor(
    private queue: IQueueStorage,
    private adapters: ISyncAdapter[],
    private monitor: IConnectivityMonitor,
    private config: SyncConfig = {
      batchSize: 10,
      maxRetries: 5,
      minConnectivity: '3g'
    }
  ) {}

  /**
   * Triggers a sync cycle if pre-conditions are met
   */
  async processQueue(): Promise<void> {
    if (this.isSyncing) return;
    
    const connectivity = await this.monitor.getConnectivity();
    if (!this.isConnectivityReady(connectivity)) {
      console.log(`[SyncEngine] Skip: connectivity ${connectivity} below threshold`);
      return;
    }

    this.isSyncing = true;
    try {
      const batch = await this.queue.getNextBatch(this.config.batchSize);
      console.log(`[SyncEngine] Processing batch of ${batch.length} records`);

      for (const record of batch) {
        await this.syncRecord(record);
      }
    } catch (error) {
      console.error('[SyncEngine] Batch processing failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncRecord(record: any): Promise<void> {
    try {
      // Parallel sync to all registered adapters
      const results = await Promise.all(
        this.adapters.map(adapter => adapter.storeRecord(record))
      );

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        await this.queue.markComplete(record.id);
      } else {
        const error = results.find(r => !r.success)?.error || 'Unknown adapter failure';
        await this.queue.markFailed(record.id, error);
      }
    } catch (error: any) {
      await this.queue.markFailed(record.id, error.message);
    }
  }

  private isConnectivityReady(current: ConnectivityType): boolean {
    const levels: ConnectivityType[] = ['none', '2g', '3g', '4g', 'wifi'];
    return levels.indexOf(current) >= levels.indexOf(this.config.minConnectivity);
  }
}
