import { ISyncAdapter, SyncRecord, SyncResult } from '../interfaces';

export class MockAdapter implements ISyncAdapter {
  name = 'MockAdapter';

  async storeRecord(record: SyncRecord): Promise<SyncResult> {
    console.log(`[MockAdapter] Syncing ${record.type}:${record.id}`);
    return { success: true, txHash: `0x_mock_${Date.now()}` };
  }
}

export class CeloAdapter implements ISyncAdapter {
  name = 'CeloAdapter';

  constructor(private rpcUrl: string, private contractAddress: string) {}

  async storeRecord(record: SyncRecord): Promise<SyncResult> {
    // In real implementation, use viem to call storeProof()
    return { success: true, txHash: '0x_celo_transaction_hash' };
  }
}
