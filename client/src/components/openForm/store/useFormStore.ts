import type { MantineColor } from "@mantine/core";
import { create, type StoreApi, type UseBoundStore } from "zustand";

/* =========================================================
   Shared / Common Types
========================================================= */

export type FieldState =
    | "EDITABLE"
    | "VIEW"
    | "HIDDEN"
    | "VIEWONLY"
    | "TABLE"
    | "ADDABLE";

export type GroupState = "EDITABLE" | "HIDDEN";

export type GroupType = "GROUP" | "TABS";

export type FieldType =
    | "NUMBER"
    | "STRING"
    | "DATE"
    | "TEXT"
    | "CUSTOM"
    | "SELECT"
    | "BOOLEAN"
    | "TABLE"
    | "TEXTAREA";

export type TableColumnType =
    | "NUMBER"
    | "SELECT"
    | "DATE"
    | "TEXT"
    | "FILE";

export type TableColumnState =
    | "EDITABLE"
    | "VIEW"
    | "HIDDEN"
    | "VIEWONLY";

/* =========================================================
   Base Field
========================================================= */

export interface IBaseField {
    /**
     * Controls rendering and interactivity of the field.
     */
    state?: FieldState;

    /**
     * Laravel-style validation rules.
     * Example: ["required|string|min:3|max:50"]
     */
    validators?: string[];

    /**
     * Validation or backend error message.
     */
    error?: string;

    /**
     * Optional helper / informational text shown with the field.
     */
    info?: string;

    /**
     * Expression used for computed values.
     * Commonly used in VIEWONLY fields or computed outputs.
     */
    expression?: string;

    /**
     * Indicates async loading state (useful for SELECT / CUSTOM fields).
     */
    loading?: boolean;
}

/* =========================================================
   Field Configs
========================================================= */

export interface IStringFieldConfig {
    /**
     * Minimum text length.
     */
    min?: number;

    /**
     * Maximum text length.
     */
    max?: number;
}

export interface INumberFieldConfig {
    /**
     * Minimum numeric value.
     */
    min?: number;

    /**
     * Maximum numeric value.
     */
    max?: number;
}

export interface IDateFieldConfig {
    /**
     * Minimum date constraint.
     * Can be interpreted by the date component implementation.
     */
    min?: number;

    /**
     * Maximum date constraint.
     * Can be interpreted by the date component implementation.
     */
    max?: number;
}

export interface ITextAreaFieldConfig {
    /**
     * Minimum text length.
     */
    min?: number;

    /**
     * Maximum text length.
     */
    max?: number;
}

export interface IBooleanFieldConfig {
    /**
     * List of field IDs to hide when checkbox/toggle is active.
     */
    hides?: string[];
}

export interface ISelectFieldConfig<T = any> {
    /**
     * Select options.
     */
    data?: T[];

    /**
     * Dependency field IDs used for cascading select loading.
     */
    loadData?: string[];
}

export interface ICustomFieldConfig {
    /**
     * Free-form config for custom components.
     */
    [key: string]: any;
}

export interface ITableFieldConfig {
    /**
     * Maximum number of rows allowed.
     */
    limit?: number | null;

    /**
     * Table column schema.
     */
    cols?: ITableColl[];

    /**
     * Endpoint used for table row server-side operations.
     */
    action?: string;

    /**
     * Used to clamp values (e.g. prevent price from exceeding previous row).
     */
    isClamped?: boolean;

    /**
     * Reserved / currently unused.
     */
    isMandatory?: string[];
}

/**
 * Legacy compatibility config.
 * Use specific configs where possible.
 */
export interface IFieldConfig
    extends Partial<IStringFieldConfig>,
        Partial<INumberFieldConfig>,
        Partial<IDateFieldConfig>,
        Partial<ITextAreaFieldConfig>,
        Partial<IBooleanFieldConfig>,
        Partial<ISelectFieldConfig>,
        Partial<ICustomFieldConfig>,
        Partial<ITableFieldConfig> {}

/* =========================================================
   Field Types
========================================================= */

export interface IStringField extends IBaseField {
    type: "STRING" | "TEXT";
    value?: string;
    config?: IStringFieldConfig;
}

export interface INumberField extends IBaseField {
    type: "NUMBER";
    value?: number;
    config?: INumberFieldConfig;
}

export interface IDateField extends IBaseField {
    type: "DATE";
    value?: string | number;
    config?: IDateFieldConfig;
}

export interface ITextAreaField extends IBaseField {
    type: "TEXTAREA";
    value?: string;
    config?: ITextAreaFieldConfig;
}

export interface IBooleanField extends IBaseField {
    type: "BOOLEAN";
    value?: boolean;
    config?: IBooleanFieldConfig;
}

export interface ISelectField<T = any> extends IBaseField {
    type: "SELECT";
    value?: string | number;
    config?: ISelectFieldConfig<T>;
}

export interface ICustomField extends IBaseField {
    type: "CUSTOM";
    value?: any;
    component: string;
    config?: ICustomFieldConfig;
}

export interface ITableField extends IBaseField {
    type: "TABLE";
    value?: any[];
    config?: ITableFieldConfig;
}

/**
 * Main discriminated union field type.
 */
export type IField =
    | IStringField
    | INumberField
    | IDateField
    | ITextAreaField
    | IBooleanField
    | ISelectField
    | ICustomField
    | ITableField;

/* =========================================================
   Table Types
========================================================= */

export type TableSelectItem = {
    id: number;
    label: string;
    data: Record<string, string>;
};

export interface ITableColl {
    /**
     * Column input type.
     */
    type: TableColumnType;

    /**
     * Column render / interaction state.
     */
    state: TableColumnState;

    /**
     * Select options for SELECT columns.
     */
    data?: TableSelectItem[];

    /**
     * Dependency field IDs for cascading select loading.
     */
    loadData?: string[];

    /**
     * Unique column identifier.
     */
    id: string;

    /**
     * Runtime expression for computed column values.
     */
    expression?: string | null;

    /**
     * Default value for the column.
     */
    default?: string | number;

    /**
     * Minimum value/date.
     */
    min?: number;

    /**
     * Maximum value/date.
     */
    max?: number;

    /**
     * Whether this column should be aggregated.
     */
    aggregate?: boolean;

    /**
     * Whether this column is required.
     */
    required?: boolean;

    /**
     * Optional URL / relation metadata.
     */
    link?: string;
}

/* =========================================================
   Groups / Layout
========================================================= */

export type GroupLayoutValue =
    | string[]
    | string[][]
    | Record<string, string[] | string[][]>;

export interface IFormGroupConfig {
    /**
     * Number of columns in group layout.
     */
    colls?: number;

    /**
     * Group title shown in UI.
     */
    title?: string;

    /**
     * Whether the group can be collapsed.
     */
    collabsable?: boolean;
}

export type FormGroup = {
    /**
     * Group visibility / activity state.
     */
    state?: GroupState;

    /**
     * Layout type.
     */
    type: GroupType;

    /**
     * Field arrangement.
     *
     * Supported:
     * - string[] => vertical list
     * - string[][] => grid / rows
     * - Record<string, ...> => tabs
     */
    value?: GroupLayoutValue;

    /**
     * Optional layout config.
     */
    config?: IFormGroupConfig;
};

/* =========================================================
   Steps / Stepper
========================================================= */

export type FormSteps = Record<string, string[]>; // group ids

export type Stepper = {
    steps: string[];
    currentStep: number;
};

/* =========================================================
   Buttons / Messages / Tabs
========================================================= */

export type Button = {
    id: string;
    value: string;
    color?: MantineColor;
};

export type Message = {
    type: "error" | "ok" | "green";
    message: string;
};

export type Tab = {
    state: "EDITABLE" | "VIEW";
    action: string;
    label: string;
    fields: Record<string, IField>;
};

/* =========================================================
   Form Definition
========================================================= */

export type FormDefinition = {
    fields: Record<string, IField>;
    buttons: Button[];
    steps?: FormSteps;
    groups: Record<string, FormGroup>;
};


/* =========================================================
   Zustand Store
========================================================= */

export interface TFormStore {
    // Steps
    steps: FormSteps;
    setSteps: (steps: FormSteps) => void;

    // Groups
    groups: Record<string, FormGroup>;
    setGroups: (groups: Record<string, FormGroup>) => void;

    // Fields
    fields: Record<string, IField>;
    setFields: (fields: Record<string, IField>) => void;
    appendFields: (newFields: Record<string, IField>) => void;
    updateFieldConfig: (fieldKey: string, newconfig: Partial<IFieldConfig>) => void;
    updateField: (fieldKey: string, updatedField: Partial<IField>) => void;
    getField: (fieldKey: string) => IField | undefined;

    // Stepper
    stepper: Stepper | null;
    setStepper: (stepper: Stepper) => void;

    // Messages
    messages: Message[];
    setMessages: (messages: Message[]) => void;

    // Buttons
    buttons: Button[];
    setButtons: (buttons: Button[]) => void;

    // Button Errors
    buttonErrors: Message[];
    setButtonErrors: (messages: Message[]) => void;

    // Alerts
    alerts: Message[];
    setAlerts: (alerts: Message[]) => void;

    // Tabs
    tabs: Record<string, Tab>;
    setTabs: (tabs: Record<string, Tab>) => void;
    getTab: (id: string) => Tab | null;
    setTabFields: (id: string, fields: Record<string, IField>) => void;

    // CSRF
    csrfToken: string;
    setCsrfToken: (token: string) => void;

    // Init
    initializeFrom: (data: FormDefinition) => void;
}

/* =========================================================
   Zustand Store Instance
========================================================= */

export const useFormStore: UseBoundStore<StoreApi<TFormStore>> =
    create<TFormStore>((set, get) => ({
        // Steps
        steps: {},
        setSteps: (steps: FormSteps) => set({ steps }),

        // Fields
        fields: {},
        setFields: (fields: Record<string, IField>) => set({ fields }),

        appendFields: (newFields: Record<string, IField>) =>
            set((state) => ({
                fields: { ...state.fields, ...newFields },
            })),

        updateField: (fieldKey: string, updatedFieldPartial: Partial<IField>) => {
            set((state) => {
                const existingField = state.fields[fieldKey];

                if (!existingField) {
                    return {
                        fields: {
                            ...state.fields,
                            [fieldKey]: updatedFieldPartial as IField,
                        },
                    };
                }

                const updatedField = {
                    ...existingField,
                    ...updatedFieldPartial,
                } as IField;

                return {
                    fields: {
                        ...state.fields,
                        [fieldKey]: updatedField,
                    },
                };
            });
        },

        getField: (fieldKey: string) => {
            const fields = get().fields;
            return fields[fieldKey];
        },

        updateFieldConfig: (
            fieldKey: string,
            newConfig: Partial<IFieldConfig>
        ) => {
            set((state) => {
                const field = state.fields[fieldKey];
                if (!field) return {};

                const updatedConfig = {
                    ...(field.config ?? {}),
                    ...newConfig,
                };

                const updatedField = {
                    ...field,
                    config: updatedConfig,
                } as IField;

                return {
                    fields: {
                        ...state.fields,
                        [fieldKey]: updatedField,
                    },
                };
            });
        },

        // Stepper
        stepper: null,
        setStepper: (stepper: Stepper) => set({ stepper }),

        // Messages
        messages: [],
        setMessages: (messages: Message[]) => set({ messages }),

        // Buttons
        buttons: [],
        setButtons: (buttons: Button[]) => set({ buttons }),

        // Button Errors
        buttonErrors: [],
        setButtonErrors: (buttonErrors: Message[]) =>
            set({ buttonErrors }),

        // Alerts
        alerts: [],
        setAlerts: (alerts: Message[]) => set({ alerts }),

        // Tabs
        tabs: {},
        setTabs: (tabs: Record<string, Tab>) => set({ tabs }),

        getTab: (id: string) => {
            const tabs = get().tabs;
            return tabs[id] ?? null;
        },

        setTabFields: (id: string, fields: Record<string, IField>) => {
            set((state) => {
                const tab = state.tabs[id];
                if (!tab) return {};

                return {
                    tabs: {
                        ...state.tabs,
                        [id]: {
                            ...tab,
                            fields,
                        },
                    },
                };
            });
        },

        // Groups
        groups: {},
        setGroups: (groups: Record<string, FormGroup>) => set({ groups }),

        // CSRF
        csrfToken: "",
        setCsrfToken: (token: string) => set({ csrfToken: token }),

        // Init
        initializeFrom: (data: FormDefinition) => {
            set({
                fields: data.fields,
                buttons: data.buttons,
                groups: data.groups,
                steps: data.steps ?? {},
            });
        },
    }));

/* =========================================================
   Utilities
========================================================= */

/**
 * Extracts all field IDs from a FormGroup.
 *
 * Supports:
 * - string[]
 * - string[][]
 * - Record<string, string[] | string[][]>
 */
export function extractFieldIds(group: FormGroup): string[] {
    const value = group.value;
    const result: string[] = [];

    if (!value) {
        return result;
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            if (typeof item === "string") {
                result.push(item);
            } else if (Array.isArray(item)) {
                result.push(...item);
            }
        }
    } else {
        for (const key in value) {
            const arrOrArrs = value[key];

            if (Array.isArray(arrOrArrs)) {
                if (arrOrArrs.length === 0) continue;

                if (typeof arrOrArrs[0] === "string") {
                    result.push(...(arrOrArrs as string[]));
                } else if (Array.isArray(arrOrArrs[0])) {
                    for (const arr of arrOrArrs as string[][]) {
                        result.push(...arr);
                    }
                }
            }
        }
    }

    return result;
}
