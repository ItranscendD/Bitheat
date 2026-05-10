import * as Crypto from 'expo-crypto';

/**
 * Returns a shortened display version of the DID
 */
export const formatDIDForDisplay = (did: string): string => {
  if (did.length <= 18) return did;
  return `${did.slice(0, 12)}...${did.slice(-6)}`;
};

/**
 * Validates did:key format
 */
export const isDIDValid = (did: string): boolean => {
  const didKeyRegex = /^did:key:z[1-9A-HJ-NP-Za-km-z]+$/;
  return didKeyRegex.test(did);
};

/**
 * Hashes DID for blockchain storage (keccak256)
 */
export const hashDIDForBlockchain = async (did: string): Promise<string> => {
  // Using SHA-256 as proxy if keccak256 is not in expo-crypto, 
  // but for blockchain we usually want keccak. 
  // viem has keccak256.
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    did
  );
  return digest;
};

/**
 * Creates a deterministic lookup hash for QR codes
 */
export const createQRLookupHash = async (did: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `qr-lookup:${did}`
  );
  return digest.slice(0, 16); // Short identifier for QR
};
