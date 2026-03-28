import {create, type StoreApi, type UseBoundStore} from "zustand";
import type {MantineColor} from "@mantine/core";

export interface IField {
    state?: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY" | "TABLE" | "ADDABLE" ;
    value?: string | number | any[];
    type: "NUMBER" | "STRING" | "DATE" | "TEXT" | "CUSTOM" | "SELECT" | "BOOLEAN" | "TABLE"  | "TEXTAREA" ;
    config?: IFieldConfig;
    component?: string;
    validators?: string[];
    error?: string;
    info?: string;
    expression?: string;
    loading?: boolean;
}


export interface IFieldConfig {
    min?: number;
    max?: number;
    data?: any[];
    limit?: number | null;
    cols?: ITableColl[];
    loadData?: string[];
    hides?: string[] // use to hide elemnts using checkbox;
    isClamped?: boolean; // used in tables to not allow price to be higher than the previous
    isMandatory?: string[]; // not used
    action?: string; // endpoint to call when editing tables on server side
}
export type TableSelectItem = {
    id: number,
    label: string,
    data: Record<string, string>,
}
export interface ITableColl {
    type: "NUMBER" | "SELECT" | "DATE" | "TEXT"  | "FILE",
    state: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY",
    data?: TableSelectItem[],
    loadData?: string[],
    id: string,
    expression?: string | null ,
    default?: string | number;
    min?: number,
    max?: number,
    aggregate?: boolean,
    required?: boolean,
    link?: string
}

export type FormGroup = {
    state?: "EDITABLE" | "HIDDEN";
    type: "GROUP"  | "TABS";
    value?:  string[] |(string[])[] | Record<string,string[] |(string[])[]>; // FieldIds// FieldIds
    config?: {
        colls?: number,
        title?: string;
        collabsable?: boolean;
    }

}

export type FormSteps =  Record<string, string[]>; // group id

export type Stepper = {
    steps: string[];
    currentStep: number;
}
export type Button ={
    id: string;
    value: string;
    color?: MantineColor;
}
export type Message =  {
    type: "error" | "ok" | "green";
    message: string;
}
export type Tab = {
    state: "EDITABLE" | "VIEW"
    action: string,
    label: string,
    fields: Record<string,IField>,
}

export type FormDefinition = {
    fields: Record<string, IField>;
    buttons: Button[];
    steps?: FormSteps;
    groups: Record<string, FormGroup>;
};


export interface TFormStore {
    // Steps
    steps: FormSteps,
    setSteps: (steps: FormSteps) => void,
    //
    groups: Record<string, FormGroup>,
    setGroups: (groups: Record<string, FormGroup>) => void,
    // Fields
    fields: { [p: string]: IField },
    setFields: (fields: { [p: string]: IField }) => void;
    appendFields: (newFields: { [key: string]: IField }) => void;
    updateFieldConfig: (fieldKey: string, newconfig: Partial<IFieldConfig>) => void;
    updateField: (fieldKey: string, updatedField: Partial<IField>) => void;
    getField: (fieldKey: string) => IField | undefined;
    // stepper
    stepper: Stepper | null;
    setStepper: (stepper: Stepper) => void;
    //messages
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    // button:
    buttons: Button[];
    setButtons: (buttons: Button[]) => void;
    // buttonErrors
    buttonErrors: Message[];
    setButtonErrors: (messages: Message[]) => void;
    // alertes
    alerts: Message[];
    setAlerts: (alerts: Message[]) => void;
    // tabs
    tabs: Record<string,Tab>
    setTabs: (tabs: Record<string, Tab>) => void;
    getTab: (id: string) => Tab | null;
    setTabFields: (id: string, field: Record<string, IField>) => void;
    // csrf
    csrfToken: string;
    setCsrfToken: (token: string) => void;

    initializeFrom: (
        data: FormDefinition
    ) => void;
}


export const useFormStore: UseBoundStore<StoreApi<TFormStore>> = create<TFormStore>((set, get) => ({
    //Steps
    steps: {},
    setSteps: (steps: FormSteps) => set({steps: steps}),
    // Fields
    fields: {},
    setFields: (fields: { [p: string]: IField }) => set({fields: fields}),
    appendFields: (newFields: { [key: string]: IField }) => set(state => {
        return {fields: {...state.fields, ...newFields}};
    }),
    updateField: (fieldKey: string, updatedFieldPartial: Partial<IField>) => {
        set(state => {
            const existingField = state.fields[fieldKey];
            if (!existingField) {
                // create a new field if it doesn't exist
                return {
                    fields: {
                        ...state.fields,
                        [fieldKey]: {...updatedFieldPartial} as IField,
                    },
                };
            }
            const updatedField = {...existingField, ...updatedFieldPartial};
            return {
                fields: {
                    ...state.fields,
                    [fieldKey]: updatedField,
                },
            };
        })
    },
    getField: (fieldKey: string) => {
        const fields = get().fields;
        return fields[fieldKey];
    },
    updateFieldConfig: (fieldKey: string, newConfig: Partial<IFieldConfig>) => {
        set(state => {
            const field = state.fields[fieldKey];
            if (!field) {
                return {};
            }
            const updatedConfig = {...field.config, ...newConfig};
            const updatedField = {...field, config: updatedConfig};
            return {
                fields: {
                    ...state.fields,
                    [fieldKey]: updatedField,
                },
            };
        });
    },
    // stepper
    stepper: null,
    setStepper: (stepper: Stepper) => set({stepper :stepper}),
    // messages
    messages: [],
    setMessages: (messages: Message[]) => set({messages : messages}),
    // buttons
    buttons: [],
    setButtons: (buttons: Button[]) => set({buttons : buttons}),
    // buttonErrors
    buttonErrors: [],
    setButtonErrors: (buttonErrors: Message[]) => set({buttonErrors : buttonErrors}),
    // alertes
    alerts: [],
    setAlerts: (alerts: Message[]) => set({alerts : alerts}),
    //
    tabs: {},
    setTabs: (tabs: Record<string,Tab>) => set({tabs : tabs}),
    getTab: (id: string)  => {
        const tabs = get().tabs;
        return tabs[id] ?? null;
    },
    setTabFields: (id: string, fields: Record<string, IField>) => {
        set( state =>  {
            const tab = state.tabs[id];
            tab.fields = fields;
            return {
                tabs:{
                    ...state.tabs,
                    [id]: tab
                }
            }
        })
    },
    //
    groups: {},
    setGroups: (groups: Record<string, FormGroup>) => set({groups : groups}),
    // csrf
    csrfToken: "",
    setCsrfToken: (token: string) => set({csrfToken:token}),

    initializeFrom: (data: FormDefinition) => {
        set({
            fields: data.fields,
            buttons: data.buttons,
            groups: data.groups,
            steps:data.steps
        });
    },
}));


export function extractFieldIds(
    group: FormGroup
): string[] {
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
                if (arrOrArrs.length === 0) {
                    continue;
                }
                if (typeof arrOrArrs[0] === "string") {
                    result.push(...(arrOrArrs as string[]));
                } else if (Array.isArray(arrOrArrs[0])) {
                    // arrOrArrs is (string[])[]
                    for (const arr of arrOrArrs as string[][]) {
                        result.push(...arr);
                    }
                }
            }
        }
    }

    return result;
}


