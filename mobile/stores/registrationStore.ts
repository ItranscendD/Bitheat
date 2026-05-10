import { create } from 'zustand';

interface RegistrationState {
  // Child Details
  name: string;
  dob: string | null;
  sex: 'male' | 'female' | 'unknown' | null;
  
  // Guardian Details
  guardianId: string | null;
  guardianName: string;
  guardianPhone: string;
  
  // Media
  photoUri: string | null;
  photoHash: string | null;
  
  // Derived
  childDID: string | null;
  ipfsCid: string | null;

  setName: (name: string) => void;
  setDOB: (dob: string) => void;
  setSex: (sex: 'male' | 'female' | 'unknown') => void;
  setGuardian: (id: string, name: string, phone: string) => void;
  setPhoto: (uri: string, hash: string) => void;
  setIdentity: (did: string, cid: string) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  name: '',
  dob: null,
  sex: null,
  guardianId: null,
  guardianName: '',
  guardianPhone: '',
  photoUri: null,
  photoHash: null,
  childDID: null,
  ipfsCid: null,

  setName: (name) => set({ name }),
  setDOB: (dob) => set({ dob }),
  setSex: (sex) => set({ sex }),
  setGuardian: (guardianId, guardianName, guardianPhone) => set({ guardianId, guardianName, guardianPhone }),
  setPhoto: (photoUri, photoHash) => set({ photoUri, photoHash }),
  setIdentity: (childDID, ipfsCid) => set({ childDID, ipfsCid }),
  reset: () => set({
    name: '',
    dob: null,
    sex: null,
    guardianId: null,
    guardianName: '',
    guardianPhone: '',
    photoUri: null,
    photoHash: null,
    childDID: null,
    ipfsCid: null
  }),
}));
