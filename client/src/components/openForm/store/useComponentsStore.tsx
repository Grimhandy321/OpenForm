import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { FC } from "react";
import { Checkbox, NumberInput, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import CustomSelect from "../componets/CustomSelect.tsx";
import FormatedDateInput from "../componets/FormatedDateInput.tsx";
import { TableGenerator } from "../generators/TableGenerator.tsx";

import type { IField, IFieldConfig } from "./useFormStore.ts";
import {FeatureCards} from "../../custom/FeatureCards.tsx";
import {CodePreview} from "../../custom/CodePreview.tsx";
import {ArchitectureStack} from "../../custom/ArchitectureStack.tsx";
import {StatsPanel} from "../../custom/StatsPanel.tsx";

/* =========================================================
   Field Component Props
========================================================= */

export type FieldComponentProps = {
    /**
     * Field ID from form definition
     */
    fieldId: string;

    /**
     * Mantine form instance
     */
    form: ReturnType<typeof useForm>;

    /**
     * Whole field object if component needs metadata
     */
    field?: IField;

    /**
     * Optional config for the field
     */
    config?: IFieldConfig;

    /**
     * Optional label / UI props
     */
    label?: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    error?: string;

    /**
     * Allow additional custom props
     */
    [key: string]: any;
};

/* =========================================================
   Field Component Registry
========================================================= */

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

/* =========================================================
   Store Interface
========================================================= */

export interface TComponentsStore {
    components: FieldComponents;

    /**
     * Replace the entire components registry
     */
    setComponents: (components: FieldComponents) => void;

    /**
     * Merge multiple built-in field component updates
     */
    updateComponents: (
        components: Partial<Omit<FieldComponents, "CUSTOM">>
    ) => void;

    /**
     * Replace a single built-in field component
     */
    updateComponent: <K extends keyof Omit<FieldComponents, "CUSTOM">>(
        key: K,
        component: FieldComponents[K]
    ) => void;

    /**
     * Add or replace a single custom component
     */
    updateCustomComponent: (
        key: string,
        component: FC<FieldComponentProps>
    ) => void;

    /**
     * Replace all custom components
     */
    setCustomComponents: (
        components: Record<string, FC<FieldComponentProps>>
    ) => void;
}

/* =========================================================
   Store Instance
========================================================= */

export const useComponentsStore: UseBoundStore<
    StoreApi<TComponentsStore>
> = create<TComponentsStore>((set) => ({
    components: {
        NUMBER: (props) => <NumberInput {...(props as any)} />,
        TEXT: (props) => <TextInput {...(props as any)} />,
        STRING: (props) => <TextInput {...(props as any)} />,
        TEXTAREA: (props) => <Textarea {...(props as any)} autosize />,
        SELECT: (props) => <CustomSelect {...props} />,
        DATE: (props) => <FormatedDateInput {...props} />,
        BOOLEAN: (props) => <Checkbox pt="xs" {...(props as any)} />,
        TABLE: (props) => <TableGenerator {...props} />,
        CUSTOM: {
            "FeatureCards": FeatureCards,
            "CodePreview": CodePreview,
            "ArchitectureStack": ArchitectureStack,
            "StatsPanel": StatsPanel,

        },
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

    setCustomComponents: (components) =>
        set((state) => ({
            components: {
                ...state.components,
                CUSTOM: components,
            },
        })),
}));
