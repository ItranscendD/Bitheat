import { getDB, Result, wrapResult } from './database';
import { ChildRecord } from '@bitheat/shared';

export const createChild = async (child: ChildRecord): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync(
      `INSERT INTO children (id, did, name, dob, sex, guardian_id, photo_hash, sync_status, celo_tx_hash, ipfs_cid, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        child.id,
        child.did,
        child.name,
        child.dob,
        child.sex,
        child.guardianId,
        child.photoHash || null,
        child.syncStatus,
        child.celoTxHash || null,
        child.ipfsCid || null,
        child.createdAt,
        child.updatedAt,
      ]
    ).then(() => undefined)
  );
};

export const getChild = async (id: string): Promise<Result<ChildRecord | null>> => {
  const db = await getDB();
  return wrapResult(
    db.getFirstAsync<any>('SELECT * FROM children WHERE id = ?', [id]).then(row => row ? mapRowToChild(row) : null)
  );
};

export const getChildByDID = async (did: string): Promise<Result<ChildRecord | null>> => {
  const db = await getDB();
  return wrapResult(
    db.getFirstAsync<any>('SELECT * FROM children WHERE did = ?', [did]).then(row => row ? mapRowToChild(row) : null)
  );
};

export const listChildren = async (limit = 20, offset = 0): Promise<Result<ChildRecord[]>> => {
  const db = await getDB();
  return wrapResult(
    db.getAllAsync<any>('SELECT * FROM children ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset])
      .then(rows => rows.map(mapRowToChild))
  );
};

export const updateChild = async (id: string, updates: Partial<ChildRecord>): Promise<Result<void>> => {
  const db = await getDB();
  const fields = Object.keys(updates).map(k => `${snakeCase(k)} = ?`).join(', ');
  const values = Object.values(updates);
  return wrapResult(
    db.runAsync(`UPDATE children SET ${fields}, updated_at = ? WHERE id = ?`, [...values, new Date().toISOString(), id])
      .then(() => undefined)
  );
};

export const updateSyncStatus = async (id: string, status: ChildRecord['syncStatus'], celoTxHash?: string, ipfsCid?: string): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync(
      'UPDATE children SET sync_status = ?, celo_tx_hash = COALESCE(?, celo_tx_hash), ipfs_cid = COALESCE(?, ipfs_cid), updated_at = ? WHERE id = ?',
      [status, celoTxHash || null, ipfsCid || null, new Date().toISOString(), id]
    ).then(() => undefined)
  );
};

export const searchChildren = async (query: string): Promise<Result<ChildRecord[]>> => {
  const db = await getDB();
  return wrapResult(
    db.getAllAsync<any>(
      "SELECT * FROM children WHERE name LIKE ? OR dob LIKE ? ORDER BY name ASC",
      [`%${query}%`, `%${query}%`]
    ).then(rows => rows.map(mapRowToChild))
  );
};

const mapRowToChild = (row: any): ChildRecord => ({
  id: row.id,
  did: row.did,
  name: row.name,
  dob: row.dob,
  sex: row.sex as any,
  guardianId: row.guardian_id,
  photoHash: row.photo_hash,
  syncStatus: row.sync_status as any,
  celoTxHash: row.celo_tx_hash,
  ipfsCid: row.ipfs_cid,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const snakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
