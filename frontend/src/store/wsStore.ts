import { create } from "zustand";

interface WsState {
  connected: boolean;
  alerts: any[];
  setConnected: (v: boolean) => void;
  addAlert: (a: any) => void;
  clearAlerts: () => void;
}

const useWsStore = create<WsState>((set) => ({
  connected: false,
  alerts: [],
  setConnected: (v) => set({ connected: v }),
  addAlert: (a) => set((s) => ({ alerts: [a, ...s.alerts].slice(0, 50) })),
  clearAlerts: () => set({ alerts: [] }),
}));

export default useWsStore;
