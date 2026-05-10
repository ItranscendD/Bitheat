import { generateDID, storeDIDKey, loadDIDKey } from '../didGenerator';
import { resolveDID, verifyDIDSignature } from '../didResolver';
import * as ed25519 from '@noble/ed25519';

describe('DID Generation & Cryptography', () => {
  it('should generate a unique did:key', async () => {
    const kp1 = await generateDID();
    const kp2 = await generateDID();
    expect(kp1.did).toMatch(/^did:key:z/);
    expect(kp1.did).not.toBe(kp2.did);
  });

  it('should complete 100 generations quickly', async () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
      await generateDID();
    }
    const duration = Date.now() - start;
    console.log(`Generated 100 DIDs in ${duration}ms`);
    expect(duration / 100).toBeLessThan(500); // Target <500ms per DID
  });

  it('should store and reload keys using a PIN', async () => {
    const { did, privateKey } = await generateDID();
    const pin = '123456';
    
    await storeDIDKey(did, privateKey, pin);
    const reloadedKey = await loadDIDKey(did, pin);
    
    expect(reloadedKey).toEqual(privateKey);
  });

  it('should fail to load key with incorrect PIN', async () => {
    const { did, privateKey } = await generateDID();
    await storeDIDKey(did, privateKey, '123456');
    
    await expect(loadDIDKey(did, 'wrong')).rejects.toThrow();
  });

  it('should resolve did:key to a valid DID Document', async () => {
    const { did } = await generateDID();
    const doc = await resolveDID(did);
    
    expect(doc.id).toBe(did);
    expect(doc.verificationMethod?.[0].publicKeyMultibase).toBeDefined();
  });

  it('should sign and verify messages', async () => {
    const { did, privateKey } = await generateDID();
    const message = new TextEncoder().encode('Hello Bitheat');
    
    const signature = await ed25519.signAsync(message, privateKey);
    const isValid = await verifyDIDSignature(did, message, signature);
    
    expect(isValid).toBe(true);
  });
});
