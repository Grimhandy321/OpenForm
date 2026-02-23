import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { FC } from "react";
import type { FieldConfig } from "../types.ts";
import { Checkbox, NumberInput, Textarea, TextInput } from "@mantine/core";
import CustomSelect from "../componets/CustomSelect.tsx";
import FormatedDateInput from "../componets/FormatedDateInput.tsx";
import { TableGenerator } from "../generators/TableGenerator.tsx";

type FieldComponentProps = FieldConfig & { fieldId: string; form?: any };

export type FieldComponents = {
    NUMBER: FC<FieldComponentProps>;
    TEXT: FC<FieldComponentProps>;
    STRING: FC<FieldComponentProps>;
    TEXTAREA: FC<FieldComponentProps>;
    SELECT: FC<FieldComponentProps>;
    DATE: FC<FieldComponentProps>;
    BOOLEAN: FC<FieldComponentProps>;
    TABLE: FC<FieldComponentProps>;
    CUSTOM: Record<string, FC<FieldComponentProps>>;
};

export interface TComponentsStore {
    components: FieldComponents;

    /** Replace all components */
    setComponents: (components: FieldComponents) => void;

    /** Merge multiple component updates */
    updateComponents: (components: Partial<Omit<FieldComponents, "CUSTOM">>) => void;

    /** Update a single component */
    updateComponent: <K extends keyof Omit<FieldComponents, "CUSTOM">>(
        key: K,
        component: FieldComponents[K]
    ) => void;

    /** Add or update custom component */
    updateCustomComponent: (
        key: string,
        component: FC<FieldComponentProps>
    ) => void;
}

export const useComponentsStore: UseBoundStore<
    StoreApi<TComponentsStore>
> = create<TComponentsStore>((set) => ({
    components: {
        NUMBER: (props) => <NumberInput {...props} />,
        TEXT: (props) => <TextInput {...props} />,
        STRING: (props) => <TextInput {...props} />,
        TEXTAREA: (props) => <Textarea {...props} autosize />,
        SELECT: (props) => <CustomSelect {...props} />,
        DATE: (props) => <FormatedDateInput {...props} />,
        BOOLEAN: (props) => <Checkbox {...props} />,
        TABLE: (props) => <TableGenerator {...props} />,
        CUSTOM: {},
    },

    setComponents: (components) => set({ components }),

    updateComponents: (partial) =>
        set((state) => ({
            components: {
                ...state.components,
                ...partial,
            },
        })),

    updateComponent: (key, component) =>
        set((state) => ({
            components: {
                ...state.components,
                [key]: component,
            },
        })),

    updateCustomComponent: (key, component) =>
        set((state) => ({
            components: {
                ...state.components,
                CUSTOM: {
                    ...state.components.CUSTOM,
                    [key]: component,
                },
            },
        })),
}));
