import * as Battery from 'expo-battery';
import { getDB } from '../db/database';
import { getSyncQueue, markAsSynced, incrementRetry } from '../db/syncQueue';
import { storeProofOnChain } from '../blockchain/celoService';
import { storeRecord } from '../ipfs/ipfsService';
import { isSyncReady } from './connectivityMonitor';
import { deriveRecordKey, getMasterKey } from '../ipfs/encryption';

const MIN_BATTERY_LEVEL = 0.15; // 15%
const BATCH_SIZE = 50;

/**
 * Checks if the device is ready to perform sync
 */
export const checkPreConditions = async (): Promise<{ canSync: boolean; reason?: string }> => {
  const battery = await Battery.getBatteryLevelAsync();
  if (battery < MIN_BATTERY_LEVEL) {
    return { canSync: false, reason: 'battery' };
  }

  const ready = await isSyncReady();
  if (!ready) {
    return { canSync: false, reason: 'no_signal' };
  }

  return { canSync: true };
};

/**
 * Processes a single sync item
 */
const processItem = async (item: any) => {
  // Logic varies based on item type
  if (item.record_type === 'care_event') {
    // 1. Fetch record from local DB
    const db = await getDB();
    const event = await db.getFirstAsync<any>('SELECT * FROM care_events WHERE id = ?', [item.record_id]);
    if (!event) throw new Error('Record not found');

    // 2. Encrypt and store on IPFS
    const masterKey = await getMasterKey();
    const encryptionKey = await deriveRecordKey(event.child_id, masterKey);
    const cid = await storeRecord(event, encryptionKey);

    // 3. Anchor proof on Celo
    // Note: We'd need the CHW wallet client here. For background sync, we might use a stored session or encrypted key.
    // Assuming storeProofOnChain handles internal logic or we provide a mock for now.
    // const txHash = await storeProofOnChain(...);

    return { cid, txHash: '0xMockHash' };
  }
  
  throw new Error(`Unknown record type: ${item.record_type}`);
};

/**
 * Runs a full sync cycle
 */
export const runSyncCycle = async () => {
  const pre = await checkPreConditions();
  if (!pre.canSync) return { success: false, reason: pre.reason };

  const batch = await getSyncQueue(BATCH_SIZE);
  if (batch.length === 0) return { success: true, count: 0 };

  let successCount = 0;

  for (const item of batch) {
    // Re-check battery before each item
    const battery = await Battery.getBatteryLevelAsync();
    if (battery < MIN_BATTERY_LEVEL) break;

    try {
      const result = await processItem(item);
      await markAsSynced(item.id, result.txHash, result.cid);
      successCount++;
    } catch (error) {
      console.error(`Sync failed for item ${item.id}:`, error);
      await incrementRetry(item.id);
    }
  }

  return { success: true, count: successCount };
};
