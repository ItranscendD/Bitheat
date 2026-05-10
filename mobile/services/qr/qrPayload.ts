import { z } from 'zod';
import * as ed25519 from '@noble/ed25519';

export const QRPayloadSchema = z.object({
  v: z.literal(1),          // Version
  did: z.string(),         // Child DID
  hash: z.string(),        // Lookup hash
  cid: z.string().optional(), // IPFS CID
  ts: z.number(),          // Timestamp
  sig: z.string()          // Signature of the payload (hex)
});

export type QRPayload = z.infer<typeof QRPayloadSchema>;

/**
 * Creates a compact signed QR payload
 */
export const createQRPayload = async (
  childDID: string,
  lookupHash: string,
  chwPrivateKey: Uint8Array,
  ipfsCid?: string
): Promise<string> => {
  const payloadBase = {
    v: 1 as const,
    did: childDID,
    hash: lookupHash,
    cid: ipfsCid,
    ts: Math.floor(Date.now() / 1000)
  };

  // Sign the stringified base
  const message = new TextEncoder().encode(JSON.stringify(payloadBase));
  const signature = await ed25519.signAsync(message, chwPrivateKey);
  
  const payload: QRPayload = {
    ...payloadBase,
    sig: Buffer.from(signature).toString('hex')
  };

  // Stringify and encode to base64url for compactness
  const json = JSON.stringify(payload);
  return Buffer.from(json).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Parses and verifies a QR payload
 */
export const parseQRPayload = async (
  raw: string,
  chwPublicKey: Uint8Array
): Promise<QRPayload> => {
  // Decode base64url
  const base64 = raw
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const json = Buffer.from(base64, 'base64').toString('utf8');
  
  const rawPayload = JSON.parse(json);
  const payload = QRPayloadSchema.parse(rawPayload);

  // Extract base data for verification
  const { sig, ...baseData } = payload;
  const message = new TextEncoder().encode(JSON.stringify(baseData));
  
  const isValid = await ed25519.verifyAsync(
    Buffer.from(sig, 'hex'),
    message,
    chwPublicKey
  );

  if (!isValid) {
    throw new Error('Invalid QR signature - payload may be forged');
  }

  return payload;
};
