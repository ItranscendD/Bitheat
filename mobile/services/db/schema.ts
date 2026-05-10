export const TABLE_SCHEMAS = {
  children: `
    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      did TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      dob TEXT NOT NULL,
      sex TEXT NOT NULL,
      guardian_id TEXT NOT NULL,
      photo_hash TEXT,
      sync_status TEXT DEFAULT 'pending',
      celo_tx_hash TEXT,
      ipfs_cid TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `,
  guardians: `
    CREATE TABLE IF NOT EXISTS guardians (
      id TEXT PRIMARY KEY,
      did TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      camp_zone TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `,
  care_events: `
    CREATE TABLE IF NOT EXISTS care_events (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      type TEXT NOT NULL,
      service_type TEXT NOT NULL,
      details_json TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      chw_id TEXT NOT NULL,
      sync_status TEXT DEFAULT 'pending',
      proof_hash TEXT,
      FOREIGN KEY (child_id) REFERENCES children (id)
    );
  `,
  chw_profiles: `
    CREATE TABLE IF NOT EXISTS chw_profiles (
      id TEXT PRIMARY KEY,
      did TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      facility_id TEXT NOT NULL,
      zone TEXT NOT NULL,
      pin_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `,
  sync_queue: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      record_type TEXT NOT NULL,
      record_id TEXT NOT NULL,
      priority INTEGER DEFAULT 5,
      retries INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `,
  cached_records: `
    CREATE TABLE IF NOT EXISTS cached_records (
      cid TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      accessed_at TEXT NOT NULL
    );
  `,
  migrations: `

    CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY
    );
  `
};
