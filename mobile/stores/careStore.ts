import { create } from 'zustand';

export type ServiceType = 'vaccination' | 'treatment' | 'checkup' | 'referral' | null;

interface CareState {
  childId: string | null;
  serviceType: ServiceType;
  
  // Dynamic details
  details: {
    vaccineId?: string;
    dose?: number;
    batchNumber?: string;
    diagnosis?: string;
    medication?: string;
    weight?: string;
    height?: string;
    referralTo?: string;
    notes?: string;
    nextDueDate?: string;
  };

  setChildId: (id: string) => void;
  setServiceType: (type: ServiceType) => void;
  updateDetails: (details: Partial<CareState['details']>) => void;
  reset: () => void;
}

export const useCareStore = create<CareState>((set) => ({
  childId: null,
  serviceType: null,
  details: {},

  setChildId: (childId) => set({ childId }),
  setServiceType: (serviceType) => set({ serviceType, details: {} }), // Reset details on type change
  updateDetails: (newDetails) => set((state) => ({ 
    details: { ...state.details, ...newDetails } 
  })),
  reset: () => set({ childId: null, serviceType: null, details: {} }),
}));
