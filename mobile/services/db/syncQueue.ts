import { getDB, Result, wrapResult } from './database';
import { SyncQueueItem } from '@bitheat/shared';

export const enqueue = async (item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retries'>): Promise<Result<void>> => {
  const db = await getDB();
  const id = `${item.recordType}_${item.recordId}_${Date.now()}`;
  return wrapResult(
    db.runAsync(
      'INSERT INTO sync_queue (id, record_type, record_id, priority, retries, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, item.recordType, item.recordId, item.priority || 5, 0, new Date().toISOString()]
    ).then(() => undefined)
  );
};

export const getSyncQueue = async (limit = 10): Promise<SyncQueueItem[]> => {
  const res = await dequeueBatch(limit);
  if (res.success) {
    return res.data;
  }
  return [];
};

export const dequeueBatch = async (limit = 10): Promise<Result<SyncQueueItem[]>> => {
  const db = await getDB();
  return wrapResult(
    db.getAllAsync<any>(
      'SELECT * FROM sync_queue ORDER BY priority ASC, created_at ASC LIMIT ?',
      [limit]
    ).then(rows => rows.map(mapRowToSyncItem))
  );
};

export const markAsSynced = async (id: string, txHash?: string, cid?: string): Promise<void> => {
  const db = await getDB();
  // In a real app, we might update the original record with the txHash/cid too
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
};

export const markComplete = async (id: string): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]).then(() => undefined)
  );
};

export const incrementRetry = async (id: string): Promise<void> => {
  await markFailed(id);
};

export const markFailed = async (id: string): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync('UPDATE sync_queue SET retries = retries + 1, priority = priority + 1 WHERE id = ?', [id])
      .then(() => undefined)
  );
};

export const getQueueSize = async (): Promise<Result<number>> => {
  const db = await getDB();
  return wrapResult(
    db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM sync_queue')
      .then(row => row?.count || 0)
  );
};

export const clearCompleted = async (): Promise<Result<void>> => {
  const db = await getDB();
  // Since we delete on complete, this might be for clearing failed ones if needed, 
  // but following the task "clearCompleted" literally:
  return wrapResult(db.runAsync('DELETE FROM sync_queue WHERE retries > 5').then(() => undefined));
};

const mapRowToSyncItem = (row: any): SyncQueueItem => ({
  id: row.id,
  recordType: row.record_type as any,
  recordId: row.record_id,
  priority: row.priority,
  retries: row.retries,
  createdAt: row.created_at,
});
