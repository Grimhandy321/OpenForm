import { create } from "zustand";

// Type for the loader function
export type CascadeLoaderFn = (params: { target: string; source: string; value: any }) => Promise<any[]>;

interface CascadeStoreState {
    loader: CascadeLoaderFn;
    setLoader: (fn: CascadeLoaderFn) => void;
    getLoader: () => CascadeLoaderFn | undefined;
}

export const useCascadeStore = create<CascadeStoreState>((set, get) => ({
    loader: async () => { console.error("Cascade fn not implemented"); return []},
    setLoader: (fn) => set({ loader: fn }),
    getLoader: () => get().loader,
}));
