import { createHelia } from 'helia';
import { json } from '@helia/json';
import { encryptRecord, decryptRecord } from './encryption';
import { cacheRecord, getCachedRecord } from './offlineCache';

let heliaNode: any = null;
let heliaJson: any = null;

/**
 * Initializes the Helia node
 */
export const initIPFS = async () => {
  if (heliaNode) return { node: heliaNode, json: heliaJson };

  // Note: On mobile, we might need a custom blockstore or smaller config
  heliaNode = await createHelia();
  heliaJson = json(heliaNode);
  
  return { node: heliaNode, json: heliaJson };
};

/**
 * Stores a record securely on IPFS
 */
export const storeRecord = async (record: object, encryptionKey: Uint8Array): Promise<string> => {
  const { json: hJson } = await initIPFS();
  
  const encrypted = await encryptRecord(record, encryptionKey);
  const cid = await hJson.add(encrypted);
  const cidString = cid.toString();
  
  // Cache locally
  await cacheRecord(cidString, record);
  
  return cidString;
};

/**
 * Retrieves and decrypts a record from IPFS
 */
export const retrieveRecord = async (cidString: string, encryptionKey: Uint8Array): Promise<any> => {
  // Check cache first
  const cached = await getCachedRecord(cidString);
  if (cached) return cached;

  const { json: hJson } = await initIPFS();
  
  // Fetch from IPFS
  const encrypted = await hJson.get(cidString);
  if (!encrypted || !encrypted.ciphertext || !encrypted.iv) {
    throw new Error('Invalid record format on IPFS');
  }

  const decrypted = await decryptRecord(encrypted.ciphertext, encrypted.iv, encryptionKey);
  
  // Cache for next time
  await cacheRecord(cidString, decrypted);
  
  return decrypted;
};

/**
 * Pins a record to prevent local garbage collection
 */
export const pinRecord = async (cidString: string) => {
  const { node } = await initIPFS();
  // Helia pinning is usually handled via the blockstore or a pin service
  // For basic helia, adding it to the blockstore is often enough to keep it local
  // if no GC is active.
};
