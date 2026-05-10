import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as ed25519 from '@noble/ed25519';
import { deriveKey } from '@stablelib/pbkdf2';
import { SHA256 } from '@stablelib/sha256';
import { AES } from '@stablelib/aes';
import { GCM } from '@stablelib/gcm';
import multibase from 'multibase';
import multicodec from 'multicodec';

export interface KeyPair {
  did: string;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

const SALT = 'bitheat-id-salt-v1'; // Static salt for key derivation
const ITERATIONS = 100000;
const KEY_LEN = 32;

/**
 * Generates a new did:key DID using ed25519
 */
export const generateDID = async (): Promise<KeyPair> => {
  const privateKey = await Crypto.getRandomBytesAsync(32);
  const publicKey = await ed25519.getPublicKeyAsync(privateKey);
  
  // Prefix for ed25519-pub (0xed) as a varint
  const prefix = multicodec.addPrefix('ed25519-pub', publicKey);
  const did = `did:key:z${multibase.encode('base58btc', prefix).toString().slice(1)}`;
  
  return { did, publicKey, privateKey };
};

/**
 * Encrypts and stores a private key using a PIN-derived key
 */
export const storeDIDKey = async (did: string, privateKey: Uint8Array, pin: string): Promise<void> => {
  const encryptionKey = await deriveKeyFromPIN(pin);
  const iv = await Crypto.getRandomBytesAsync(12); // GCM recommended IV size
  
  const aes = new AES(encryptionKey);
  const gcm = new GCM(aes);
  
  const encrypted = gcm.seal(iv, privateKey);
  
  // Store IV + Encrypted data as hex
  const storageData = JSON.stringify({
    iv: Buffer.from(iv).toString('hex'),
    cipher: Buffer.from(encrypted).toString('hex')
  });
  
  await SecureStore.setItemAsync(`bitheat:did:${did}`, storageData);
};

/**
 * Loads and decrypts a private key using a PIN
 */
export const loadDIDKey = async (did: string, pin: string): Promise<Uint8Array | null> => {
  const storageData = await SecureStore.getItemAsync(`bitheat:did:${did}`);
  if (!storageData) return null;
  
  const { iv, cipher } = JSON.parse(storageData);
  const encryptionKey = await deriveKeyFromPIN(pin);
  
  const aes = new AES(encryptionKey);
  const gcm = new GCM(aes);
  
  const decrypted = gcm.open(
    Buffer.from(iv, 'hex'),
    Buffer.from(cipher, 'hex')
  );
  
  if (!decrypted) throw new Error('Decryption failed - incorrect PIN?');
  
  return decrypted;
};

const deriveKeyFromPIN = async (pin: string): Promise<Uint8Array> => {
  return deriveKey(
    SHA256,
    new TextEncoder().encode(pin),
    new TextEncoder().encode(SALT),
    ITERATIONS,
    KEY_LEN
  );
};
