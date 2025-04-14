import { create } from 'zustand';

export const useDNAStore = create(set => ({
  hoveredSequence: 4,
  selectedSequence: undefined,
  selectedMemory: undefined,
  selectedIndex: 0,
  setSelectedIndex: index => set({ selectedIndex: index }),
  setHoveredSequence: sequence => set({ hoveredSequence: sequence }),
  setSelectedSequence: sequence => set({ selectedSequence: sequence }),
  resetSelectedSequence: () => set({ selectedSequence: undefined }),
  setSelectedMemory: memory => set({ selectedMemory: memory }),
  resetSelectedMemory: () => set({ selectedMemory: undefined }),
}));
