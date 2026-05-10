import * as SQLite from 'expo-sqlite';
import { TABLE_SCHEMAS } from './schema';

const DATABASE_NAME = 'bitheat.db';
const CURRENT_VERSION = 1;

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
};

export const initDB = async (): Promise<void> => {
  const database = await getDB();

  // Create tables
  await database.execAsync(`
    PRAGMA foreign_keys = ON;
    ${TABLE_SCHEMAS.children}
    ${TABLE_SCHEMAS.guardians}
    ${TABLE_SCHEMAS.care_events}
    ${TABLE_SCHEMAS.chw_profiles}
    ${TABLE_SCHEMAS.sync_queue}
    ${TABLE_SCHEMAS.cached_records}
    ${TABLE_SCHEMAS.migrations}

  `);

  // Run migrations
  await runMigrations(database);
};

const runMigrations = async (database: SQLite.SQLiteDatabase): Promise<void> => {
  const result = await database.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM migrations'
  );
  
  const currentDbVersion = result?.version || 0;

  if (currentDbVersion < CURRENT_VERSION) {
    // Implement migration logic here as version increases
    // For version 1, we just record it if not already there
    if (currentDbVersion === 0) {
      await database.runAsync('INSERT INTO migrations (version) VALUES (?)', [1]);
    }
  }
};

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export function wrapResult<T>(promise: Promise<T>): Promise<Result<T>> {
  return promise
    .then((data) => ({ success: true as const, data }))
    .catch((error) => ({ success: false as const, error }));
}
