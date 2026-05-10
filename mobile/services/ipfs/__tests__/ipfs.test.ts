import { encryptRecord, decryptRecord, deriveRecordKey } from '../encryption';
import { fromString } from 'uint8arrays';

// Mock Helia for unit tests
jest.mock('helia', () => ({
  createHelia: jest.fn().mockResolvedValue({
    libp2p: { getPeers: jest.fn().mockResolvedValue([]) }
  })
}));

jest.mock('@helia/json', () => ({
  json: jest.fn().mockReturnValue({
    add: jest.fn().mockResolvedValue('QmTestCID'),
    get: jest.fn()
  })
}));

describe('IPFS & Encryption Service', () => {
  const masterKey = new Uint8Array(32).fill(1);
  const childDID = 'did:key:z6MkpTHR8VNsBx7Bx5a9yXfQ3TqS2C8E5G7I9K1M3O5Q';

  it('should derive a deterministic key from DID', async () => {
    const key1 = await deriveRecordKey(childDID, masterKey);
    const key2 = await deriveRecordKey(childDID, masterKey);
    
    expect(key1).toEqual(key2);
    expect(key1.length).toBe(32);
  });

  it('should encrypt and decrypt a record correctly', async () => {
    const recordKey = await deriveRecordKey(childDID, masterKey);
    const originalRecord = {
      name: 'John Doe',
      condition: 'Healthy',
      vax: ['BCG', 'Polio']
    };

    const { ciphertext, iv } = await encryptRecord(originalRecord, recordKey);
    expect(ciphertext).toBeDefined();
    expect(iv).toBeDefined();

    const decrypted = await decryptRecord(ciphertext, iv, recordKey);
    expect(decrypted).toEqual(originalRecord);
  });

  it('should fail to decrypt with wrong key', async () => {
    const recordKey = await deriveRecordKey(childDID, masterKey);
    const wrongKey = new Uint8Array(32).fill(2);
    const record = { data: 'secret' };

    const { ciphertext, iv } = await encryptRecord(record, recordKey);
    
    await expect(decryptRecord(ciphertext, iv, wrongKey)).rejects.toThrow();
  });
});
