import { create } from 'zustand';
import { DensityLevel } from '../types';

interface AppState {
  densities: Record<string, DensityLevel>;
  setDensity: (zoneId: string, density: DensityLevel) => void;
  setAllDensities: (densities: Record<string, DensityLevel>) => void;
  
  selectedGate: string;
  setSelectedGate: (gate: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  densities: {},
  setDensity: (zoneId, density) => 
    set((state) => ({ densities: { ...state.densities, [zoneId]: density } })),
  setAllDensities: (densities) => set({ densities }),
  
  selectedGate: 'C', // Default selected
  setSelectedGate: (gate) => set({ selectedGate: gate }),
}));
