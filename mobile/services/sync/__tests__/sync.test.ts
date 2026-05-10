import { runSyncCycle, checkPreConditions } from '../syncEngine';
import * as Battery from 'expo-battery';
import { getSyncQueue, markAsSynced } from '../../db/syncQueue';

// Mocks
jest.mock('expo-battery', () => ({
  getBatteryLevelAsync: jest.fn(),
}));

jest.mock('../connectivityMonitor', () => ({
  isSyncReady: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../db/syncQueue', () => ({
  getSyncQueue: jest.fn(),
  markAsSynced: jest.fn(),
  incrementRetry: jest.fn(),
}));

jest.mock('../../db/database', () => ({
  getDB: jest.fn().mockResolvedValue({
    getFirstAsync: jest.fn().mockResolvedValue({ id: 'event1', child_id: 'child1' })
  })
}));

jest.mock('../ipfs/ipfsService', () => ({
  storeRecord: jest.fn().mockResolvedValue('QmCID123')
}));

describe('Sync Engine Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should abort sync if battery is below 15%', async () => {
    (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.10);
    
    const result = await checkPreConditions();
    expect(result.canSync).toBe(false);
    expect(result.reason).toBe('battery');

    const cycle = await runSyncCycle();
    expect(cycle.reason).toBe('battery');
    expect(getSyncQueue).not.toHaveBeenCalled();
  });

  it('should process a batch of records successfully', async () => {
    (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.80);
    (getSyncQueue as jest.Mock).mockResolvedValue([
      { id: '1', record_type: 'care_event', record_id: 'event1' },
      { id: '2', record_type: 'care_event', record_id: 'event2' }
    ]);

    const result = await runSyncCycle();
    
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
    expect(markAsSynced).toHaveBeenCalledTimes(2);
  });

  it('should stop mid-batch if battery drops low', async () => {
    (Battery.getBatteryLevelAsync as jest.Mock)
      .mockResolvedValueOnce(0.80) // Initial check
      .mockResolvedValueOnce(0.80) // Check before item 1
      .mockResolvedValueOnce(0.10); // Check before item 2

    (getSyncQueue as jest.Mock).mockResolvedValue([
      { id: '1', record_type: 'care_event', record_id: 'event1' },
      { id: '2', record_type: 'care_event', record_id: 'event2' }
    ]);

    const result = await runSyncCycle();
    
    expect(result.count).toBe(1);
    expect(markAsSynced).toHaveBeenCalledTimes(1);
  });
});
