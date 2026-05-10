import { createQRPayload, parseQRPayload } from '../qrPayload';
import * as ed25519 from '@noble/ed25519';
import { generateDID } from '../../did/didGenerator';

describe('QR Payload Service', () => {
  let privateKey: Uint8Array;
  let publicKey: Uint8Array;

  beforeAll(async () => {
    const kp = await generateDID();
    privateKey = kp.privateKey;
    publicKey = kp.publicKey;
  });

  it('should create and parse a payload correctly', async () => {
    const childDID = 'did:key:z6MkpTHR8VNsBx7Bx5a9yXfQ3TqS2C8E5G7I9K1M3O5Q';
    const lookupHash = 'abc123def456';
    
    const rawPayload = await createQRPayload(childDID, lookupHash, privateKey);
    console.log(`Payload length: ${rawPayload.length} bytes`);
    
    expect(rawPayload.length).toBeLessThan(300);

    const parsed = await parseQRPayload(rawPayload, publicKey);
    expect(parsed.did).toBe(childDID);
    expect(parsed.hash).toBe(lookupHash);
    expect(parsed.v).toBe(1);
  });

  it('should fail if signature is invalid', async () => {
    const childDID = 'did:key:z6MkpTHR8VNsBx7Bx5a9yXfQ3TqS2C8E5G7I9K1M3O5Q';
    const lookupHash = 'abc123def456';
    
    const rawPayload = await createQRPayload(childDID, lookupHash, privateKey);
    
    // Create a different keypair for verification
    const otherKp = await generateDID();
    const otherPub = otherKp.publicKey;

    await expect(parseQRPayload(rawPayload, otherPub)).rejects.toThrow('Invalid QR signature');
  });
});
