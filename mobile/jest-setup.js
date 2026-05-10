jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => ({
    execAsync: jest.fn().mockResolvedValue(undefined),
    runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
    getFirstAsync: jest.fn().mockResolvedValue({ version: 1 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: jest.fn(async (len) => {
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
    return bytes;
  }),
  digestStringAsync: jest.fn(async (algo, str) => `mocked-hash-${str}`),
  CryptoDigestAlgorithm: {
    SHA256: 'SHA-256'
  }
}));

const mockStore = new Map();
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(async (key, val) => { mockStore.set(key, val); }),
  getItemAsync: jest.fn(async (key) => mockStore.get(key) || null),
}));

jest.mock('expo-camera', () => ({
  CameraView: (props: any) => null,
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

jest.mock('expo-print', () => ({
  printAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn(),
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success' },
}));

jest.mock('react-native-view-shot', () => 'ViewShot');
jest.mock('react-native-qrcode-svg', () => 'QRCode');


