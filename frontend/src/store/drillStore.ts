import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface Rig {
  id: number;
  rig_name: string;
  rig_type: string;
  status: string;
  depth_current: number;
  depth_target: number;
  rop_rate_ft_hr: number;
  mud_weight: number;
  bit_type: string;
  bit_hours: number;
}

interface Stats {
  total_rigs: number;
  active_drilling: number;
  avg_rop: number;
  avg_depth: number;
}

interface DrillState {
  rigs: Rig[];
  stats: Stats | null;
  loading: boolean;
  fetchRigs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  submitRig: (data: any) => Promise<void>;
  deleteRig: (id: number) => Promise<void>;
}

const useDrillStore = create<DrillState>((set) => ({
  rigs: [],
  stats: null,
  loading: false,
  fetchRigs: async () => {
    set({ loading: true });
    const { data } = await api.get("/rigs/");
    set({ rigs: data, loading: false });
  },
  fetchStats: async () => {
    const { data } = await api.get("/rigs/stats");
    set({ stats: data });
  },
  submitRig: async (rigData) => {
    await api.post("/rigs/", rigData);
  },
  deleteRig: async (id) => {
    await api.delete(`/rigs/${id}`);
  },
}));

export default useDrillStore;
