import { getDB, Result, wrapResult } from './database';
import { CHWProfile } from '@bitheat/shared';

export const createCHWProfile = async (profile: CHWProfile): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync(
      'INSERT INTO chw_profiles (id, did, name, facility_id, zone, pin_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [profile.id, profile.did, profile.name, profile.facilityId, profile.zone, profile.pinHash, profile.createdAt]
    ).then(() => undefined)
  );
};

export const getCHWProfile = async (id: string): Promise<Result<CHWProfile | null>> => {
  const db = await getDB();
  return wrapResult(
    db.getFirstAsync<any>('SELECT * FROM chw_profiles WHERE id = ?', [id]).then(row => row ? mapRowToProfile(row) : null)
  );
};

export const updateCHWProfile = async (id: string, updates: Partial<CHWProfile>): Promise<Result<void>> => {
  const db = await getDB();
  const fields = Object.keys(updates).map(k => `${snakeCase(k)} = ?`).join(', ');
  const values = Object.values(updates);
  return wrapResult(
    db.runAsync(`UPDATE chw_profiles SET ${fields} WHERE id = ?`, [...values, id])
      .then(() => undefined)
  );
};

const mapRowToProfile = (row: any): CHWProfile => ({
  id: row.id,
  did: row.did,
  name: row.name,
  facilityId: row.facility_id,
  zone: row.zone,
  pinHash: row.pin_hash,
  createdAt: row.created_at,
});

const snakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
