import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isSidebarOpen: true,
  isCommandPaletteOpen: false,
  activeProject: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setActiveProject: (project) => set({ activeProject: project })
}));
