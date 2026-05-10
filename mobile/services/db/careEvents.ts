import { getDB, Result, wrapResult } from './database';
import { CareEvent } from '@bitheat/shared';

export const createCareEvent = async (event: CareEvent): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync(
      `INSERT INTO care_events (id, child_id, type, service_type, details_json, timestamp, chw_id, sync_status, proof_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.id,
        event.childId,
        event.type,
        event.serviceType,
        JSON.stringify(event.details),
        event.timestamp,
        event.chwId,
        event.syncStatus,
        event.proofHash || null,
      ]
    ).then(() => undefined)
  );
};

export const getCareEvent = async (id: string): Promise<Result<CareEvent | null>> => {
  const db = await getDB();
  return wrapResult(
    db.getFirstAsync<any>('SELECT * FROM care_events WHERE id = ?', [id]).then(row => row ? mapRowToEvent(row) : null)
  );
};

export const listCareEventsForChild = async (childId: string): Promise<Result<CareEvent[]>> => {
  const db = await getDB();
  return wrapResult(
    db.getAllAsync<any>('SELECT * FROM care_events WHERE child_id = ? ORDER BY timestamp DESC', [childId])
      .then(rows => rows.map(mapRowToEvent))
  );
};

export const updateCareEventSyncStatus = async (id: string, status: CareEvent['syncStatus'], proofHash?: string): Promise<Result<void>> => {
  const db = await getDB();
  return wrapResult(
    db.runAsync(
      'UPDATE care_events SET sync_status = ?, proof_hash = COALESCE(?, proof_hash) WHERE id = ?',
      [status, proofHash || null, id]
    ).then(() => undefined)
  );
};

const mapRowToEvent = (row: any): CareEvent => ({
  id: row.id,
  childId: row.child_id,
  type: row.type as any,
  serviceType: row.service_type,
  details: JSON.parse(row.details_json),
  timestamp: row.timestamp,
  chwId: row.chw_id,
  syncStatus: row.sync_status as any,
  proofHash: row.proof_hash,
});
