import { create } from 'zustand';

interface AuthFormState {
  name: string;
  facilityId: string;
  zone: string;
  pin: string;
  
  setName: (name: string) => void;
  setFacilityId: (id: string) => void;
  setZone: (zone: string) => void;
  setPin: (pin: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthFormState>((set) => ({
  name: '',
  facilityId: '',
  zone: '',
  pin: '',

  setName: (name) => set({ name }),
  setFacilityId: (facilityId) => set({ facilityId }),
  setZone: (zone) => set({ zone }),
  setPin: (pin) => set({ pin }),
  reset: () => set({ name: '', facilityId: '', zone: '', pin: '' }),
}));
