/**
 * Bitheat Core Data Models
 * Shared across mobile, admin, and backend services.
 */

export interface ChildRecord {
  id: string;
  did: string;
  name: string;
  dob: string;           // ISO 8601
  sex: 'M' | 'F' | 'U';
  guardianId: string;
  photoHash?: string;    // IPFS CID of encrypted photo, never a URL
  syncStatus: 'pending' | 'synced' | 'failed';
  celoTxHash?: string;
  ipfsCid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareEvent {
  id: string;
  childId: string;
  type: 'vaccination' | 'treatment' | 'checkup' | 'referral';
  serviceType: string;
  details: Record<string, string>;
  timestamp: string;
  chwId: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  proofHash?: string;    // Celo Proof of Care hash
}

export interface SyncQueueItem {
  id: string;
  recordType: 'child' | 'care_event' | 'guardian' | 'chw_profile';
  recordId: string;
  priority: number;
  retries: number;
  createdAt: string;
}

export interface Guardian {
  id: string;
  did: string;
  name: string;
  phone: string;
  campZone: string;
  createdAt: string;
}

export interface CHWProfile {
  id: string;
  did: string;
  name: string;
  facilityId: string;
  zone: string;
  pinHash: string; // SHA-256 of 6-digit PIN
  createdAt: string;
}

export interface DIDDocument {
  id: string;
  '@context'?: string | string[];
  verificationMethod?: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase?: string;
    publicKeyJwk?: Record<string, any>;
  }>;
  authentication?: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
}



/**
 * Design Tokens
 */
export const BITHEAT_TOKENS = {
  colors: {
    primary: '#0CCE8B', // Bitheat Emerald
    blockchain: '#6D28D9', // Bitheat Indigo
    warning: '#F59E0B', // Amber
    alert: '#EF4444', // Red
    background: '#0D1117', // Field dark bg
    surface: '#161B22', // Field surface
    text: '#E6EDF3', // Field text
  },
  fonts: {
    display: 'SpaceGrotesk_700Bold',
    body: 'DMSans_400Regular',
    mono: 'SpaceMono_400Regular',
  },
} as const;
