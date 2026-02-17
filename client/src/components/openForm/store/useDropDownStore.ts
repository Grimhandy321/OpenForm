import {create} from "zustand";
import type {SelectItem} from "../types.ts";

interface UseDropDownStore {
    dropdownData: Record<string, SelectItem[]>;
    setDropdownData: (key: string, data: SelectItem[]) => void;
    clearDropdownData: (key: string) => void;
    clearAll: () => void;
    exists: (key: string) => boolean;
    getDropdownData: (key: string) => SelectItem[];
}
export interface DropDownResult {
    target: string,
    data: SelectItem[],
}

export const useDropdownStore = create<UseDropDownStore>((set, get) => ({
    dropdownData: {},
    setDropdownData: (key, data) =>
        set((state) => ({
            dropdownData: {
                ...state.dropdownData,
                [key]: data,
            },
        })),

    clearDropdownData: (key) =>
        set((state) => {
            const newData = { ...state.dropdownData };
            newData[key] = [];
            return { dropdownData: newData };
        }),
    clearAll: () => set({ dropdownData: {} }),
    exists: (key) => {
        const data = get().dropdownData[key];
        return !!data && data.length > 0;
    },
    // @ts-ignore
    getDropdownData: (key) => {
        return get().dropdownData[key];
        }
}));
