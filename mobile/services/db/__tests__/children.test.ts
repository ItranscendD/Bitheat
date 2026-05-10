import * as SQLite from 'expo-sqlite';
import { createChild, getChildByDID } from '../children';
import { ChildRecord } from '@bitheat/shared';

describe('Children Service', () => {
  const mockChild: ChildRecord = {
    id: 'child_123',
    did: 'did:key:z6MkpTHR8VNsBx7Bx5a9yXfQ3TqS2C8E5G7I9K1M3O5Q',
    name: 'Chidubem Okafor',
    dob: '2020-05-10',
    sex: 'M',
    guardianId: 'guardian_456',
    syncStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should create a child record', async () => {
    const result = await createChild(mockChild);
    expect(result.success).toBe(true);
  });

  it('should retrieve a child by DID', async () => {
    const db = await SQLite.openDatabaseAsync('bitheat.db');
    (db.getFirstAsync as jest.Mock).mockResolvedValueOnce({
      id: mockChild.id,
      did: mockChild.did,
      name: mockChild.name,
      dob: mockChild.dob,
      sex: mockChild.sex,
      guardian_id: mockChild.guardianId,
      sync_status: mockChild.syncStatus,
      created_at: mockChild.createdAt,
      updated_at: mockChild.updatedAt,
    });

    const result = await getChildByDID(mockChild.did);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data?.name).toBe('Chidubem Okafor');
    }
  });
});
