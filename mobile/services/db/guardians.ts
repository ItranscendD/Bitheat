import { getDB, Result, wrapResult } from './database';
import { Guardian } from '@bitheat/shared';

export const createGuardian = async (guardian: Guardian): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync(
      'INSERT INTO guardians (id, did, name, phone, camp_zone, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [guardian.id, guardian.did, guardian.name, guardian.phone, guardian.campZone, guardian.createdAt]
    ).then(() => undefined)
  );
};

export const getGuardian = async (id: string): Promise<Result<Guardian | null>> => {
  const db = await getDB();
  return wrapResult(
    db.getFirstAsync<any>('SELECT * FROM guardians WHERE id = ?', [id]).then(row => row ? mapRowToGuardian(row) : null)
  );
};

export const searchGuardians = async (query: string): Promise<Result<Guardian[]>> => {
  const db = await getDB();
  return wrapResult(
    db.getAllAsync<any>(
      "SELECT * FROM guardians WHERE name LIKE ? OR phone LIKE ? ORDER BY name ASC",
      [`%${query}%`, `%${query}%`]
    ).then(rows => rows.map(mapRowToGuardian))
  );
};

const mapRowToGuardian = (row: any): Guardian => ({
  id: row.id,
  did: row.did,
  name: row.name,
  phone: row.phone,
  campZone: row.camp_zone,
  createdAt: row.created_at,
});
