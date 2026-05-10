import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { AES } from '@stablelib/aes';
import { GCM } from '@stablelib/gcm';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { fromString, toString } from 'uint8arrays';

const MASTER_KEY_ALIAS = 'bitheat:master_key';

/**
 * Generates or retrieves a 32-byte master key
 */
export const getMasterKey = async (): Promise<Uint8Array> => {
  let keyHex = await SecureStore.getItemAsync(MASTER_KEY_ALIAS);
  if (!keyHex) {
    const bytes = await Crypto.getRandomBytesAsync(32);
    keyHex = toString(bytes, 'hex');
    await SecureStore.setItemAsync(MASTER_KEY_ALIAS, keyHex);
  }
  return fromString(keyHex, 'hex');
};

/**
 * Derives a child-specific encryption key using HKDF
 */
export const deriveRecordKey = async (childDID: string, masterKey: Uint8Array): Promise<Uint8Array> => {
  return hkdf(sha256, masterKey, fromString(childDID), fromString('bitheat:record:v1'), 32);
};

/**
 * Encrypts an object record using AES-256-GCM
 */
export const encryptRecord = async (record: object, key: Uint8Array) => {
  const plaintext = fromString(JSON.stringify(record));
  const iv = await Crypto.getRandomBytesAsync(12);
  
  const aes = new AES(key);
  const gcm = new GCM(aes);
  
  const ciphertextWithTag = gcm.seal(iv, plaintext);
  
  // GCM.seal returns ciphertext + tag appended
  // We'll separate or keep together. Standard GCM often appends tag.
  return {
    ciphertext: toString(ciphertextWithTag, 'base64url'),
    iv: toString(iv, 'base64url')
  };
};

/**
 * Decrypts a ciphertext using AES-256-GCM
 */
export const decryptRecord = async (ciphertext: string, iv: string, key: Uint8Array): Promise<any> => {
  const cipherBytes = fromString(ciphertext, 'base64url');
  const ivBytes = fromString(iv, 'base64url');
  
  const aes = new AES(key);
  const gcm = new GCM(aes);
  
  const decrypted = gcm.open(ivBytes, cipherBytes);
  if (!decrypted) throw new Error('Decryption failed');
  
  return JSON.parse(toString(decrypted));
};
