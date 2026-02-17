import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { FC } from "react";
import type {FieldConfig} from "../types.ts";


// CUSTOM fields can be a key-value object
export type FieldComponents = {
    NUMBER: FC<FieldConfig & { field?: any; form?: any }>;
    TEXT: FC<FieldConfig & { field?: any; form?: any }>;
    STRING: FC<FieldConfig & { field?: any; form?: any }>;
    TEXTAREA: FC<FieldConfig & { field?: any; form?: any }>;
    SELECT: FC<FieldConfig & { field?: any; form?: any }>;
    DATE: FC<FieldConfig & { field?: any; form?: any }>;
    BOOLEAN: FC<FieldConfig & { field?: any; form?: any }>;
    CUSTOM: Record<string, FC<FieldConfig & { field?: any; form?: any }>>;
    TABLE: FC<FieldConfig & { field?: any; form?: any }>;
};

export interface TComponentsStore {
    components: FieldComponents;
    setComponents: (components: FieldComponents) => void;
    updateComponent: <K extends keyof FieldComponents>(
        key: K,
        component: FieldComponents[K]
    ) => void;
    updateCustomComponent: (key: string, component: FC<FieldConfig & { field?: any; form?: any }>) => void;
}

export const useComponentsStore: UseBoundStore<StoreApi<TComponentsStore>> = create<TComponentsStore>((set) => ({
    components: {
        NUMBER: () => null,
        TEXT: () => null,
        STRING: () => null,
        TEXTAREA: () => null,
        SELECT: () => null,
        DATE: () => null,
        BOOLEAN: () => null,
        CUSTOM: {},
        TABLE: () => null,
    },
    setComponents: (components) => set({ components }),
    updateComponent: (key, component) => set((state) => ({
        components: { ...state.components, [key]: component }
    })),
    updateCustomComponent: (key, component) => set((state) => ({
        components: { ...state.components, CUSTOM: { ...state.components.CUSTOM, [key]: component } }
    })),
}));
