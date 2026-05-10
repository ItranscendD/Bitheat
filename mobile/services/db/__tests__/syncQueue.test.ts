import * as SQLite from 'expo-sqlite';
import { enqueue, dequeueBatch, markComplete } from '../syncQueue';

describe('Sync Queue Service', () => {
  it('should enqueue an item', async () => {
    const result = await enqueue({
      recordType: 'child',
      recordId: 'child_123',
      priority: 1,
    });
    expect(result.success).toBe(true);
  });

  it('should dequeue a batch of items', async () => {
    const db = await SQLite.openDatabaseAsync('bitheat.db');
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      {
        id: 'sync_1',
        record_type: 'child',
        record_id: 'child_123',
        priority: 1,
        retries: 0,
        created_at: new Date().toISOString(),
      }
    ]);

    const result = await dequeueBatch(10);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.length).toBe(1);
      expect(result.data[0].recordId).toBe('child_123');
    }
  });

  it('should mark an item as complete by deleting it', async () => {
    const result = await markComplete('sync_1');
    expect(result.success).toBe(true);
  });
});
