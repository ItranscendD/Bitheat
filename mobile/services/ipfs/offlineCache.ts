import { getDB } from '../db/database';

const MAX_CACHE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

/**
 * Stores a decrypted record in the local SQLite cache
 */
export const cacheRecord = async (cid: string, record: any) => {
  const db = await getDB();
  const dataJson = JSON.stringify(record);
  const sizeBytes = new TextEncoder().encode(dataJson).length;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT OR REPLACE INTO cached_records (cid, data_json, size_bytes, accessed_at)
     VALUES (?, ?, ?, ?)`,
    [cid, dataJson, sizeBytes, now]
  );

  // Evict if necessary
  await evictIfNecessary();
};

/**
 * Retrieves a record from the local SQLite cache
 */
export const getCachedRecord = async (cid: string): Promise<any | null> => {
  const db = await getDB();
  const now = new Date().toISOString();

  const record = await db.getFirstAsync<{ data_json: string }>(
    'SELECT data_json FROM cached_records WHERE cid = ?',
    [cid]
  );

  if (record) {
    // Update access time for LRU
    await db.runAsync(
      'UPDATE cached_records SET accessed_at = ? WHERE cid = ?',
      [now, cid]
    );
    return JSON.parse(record.data_json);
  }

  return null;
};

/**
 * Evicts least recently accessed records if cache size exceeds limit
 */
const evictIfNecessary = async () => {
  const db = await getDB();
  
  const totalSizeResult = await db.getFirstAsync<{ total: number }>(
    'SELECT SUM(size_bytes) as total FROM cached_records'
  );
  
  const totalSize = totalSizeResult?.total || 0;

  if (totalSize > MAX_CACHE_SIZE_BYTES) {
    // Delete oldest accessed records until we're under 80% of limit
    const targetSize = MAX_CACHE_SIZE_BYTES * 0.8;
    let currentTotal = totalSize;

    while (currentTotal > targetSize) {
      const oldest = await db.getFirstAsync<{ cid: string, size_bytes: number }>(
        'SELECT cid, size_bytes FROM cached_records ORDER BY accessed_at ASC LIMIT 1'
      );

      if (!oldest) break;

      await db.runAsync('DELETE FROM cached_records WHERE cid = ?', [oldest.cid]);
      currentTotal -= oldest.size_bytes;
    }
  }
};
