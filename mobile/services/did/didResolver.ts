import multibase from 'multibase';
import multicodec from 'multicodec';
import * as ed25519 from '@noble/ed25519';
import { DIDDocument } from '@bitheat/shared';

/**
 * Resolves a did:key DID to a W3C DID Document
 */
export const resolveDID = async (did: string): Promise<DIDDocument> => {
  if (!did.startsWith('did:key:z')) {
    throw new Error('Only did:key:z (base58btc) is supported');
  }

  const base58Part = did.slice(9);
  // multibase.decode expects the prefix 'z', so we prepend it if multibase.decode handles it or use the string
  const decoded = multibase.decode(`z${base58Part}`);
  const publicKey = multicodec.rmPrefix(decoded);
  const publicKeyMultibase = `z${base58Part}`;

  return {
    id: did,
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1'
    ],
    verificationMethod: [{
      id: `${did}#keys-1`,
      type: 'Ed25519VerificationKey2020',
      controller: did,
      publicKeyMultibase: publicKeyMultibase
    }],
    authentication: [`${did}#keys-1`],
    assertionMethod: [`${did}#keys-1`],
    keyAgreement: [`${did}#keys-1`]
  };
};

/**
 * Verifies a signature made by a DID
 */
export const verifyDIDSignature = async (
  did: string,
  message: Uint8Array,
  signature: Uint8Array
): Promise<boolean> => {
  const base58Part = did.slice(9);
  const decoded = multibase.decode(`z${base58Part}`);
  const publicKey = multicodec.rmPrefix(decoded);
  
  return await ed25519.verifyAsync(signature, message, publicKey);
};
