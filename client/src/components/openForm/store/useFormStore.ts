import {create, type StoreApi, type UseBoundStore} from "zustand";
import type {MantineColor} from "@mantine/core";

export interface IField {
    state?: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY" | "TABLE" | "ADDABLE" ;
    value?: string | number | any[];
    type: "NUMBER" | "STRING" | "DATE" | "TEXT" | "CUSTOM" | "SELECT" | "BOOLEAN" | "TABLE"  | "TEXTAREA" ;
    config?: IFieldConfig;
    component: string;
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
    loadData: string[],
    id: string,
    expression: string | null ,
    default?: string | number;
    min?: number,
    max?: number,
    aggregate: boolean,
    required: boolean,
    link?: string
}

export type FormGroup = {
    state?: "EDITABLE" | "HIDDEN";
    type: "GROUP";
    value?: string[]; // FieldIds
    config?: {
        colls?: number,
        title?: string;
        collabsable?: boolean;
    }

}
export type FormStep =  Record<string, FormGroup | string>;

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

export interface TFormStore {
    // Steps
    steps: Record<string, FormStep>,
    setSteps: (steps: Record<string, FormStep>) => void,
    //
    groups: Record<string, FormGroup>,
    setGroups: (groups: Record<string, FormGroup>) => void,
    appendSteps: (steps: Record<string, FormStep>) => void,
    getStep: (stepId: string) => FormStep,
    updateStep: (stepId: string, step: FormStep) => void,
    // Form
    form: any,
    setForm: (form: any) => void,
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
}



export const useFormStore: UseBoundStore<StoreApi<TFormStore>> = create<TFormStore>((set, get) => ({
    //Steps
    steps: {},
    setSteps: (steps: Record<string, FormStep>) => set({steps: steps}),
    appendSteps: (steps: Record<string, FormStep>) => set(state => {
        return {steps: {...state.steps, ...steps}}
    }),
    getStep: (stepId: string) => {
        const steps = get().steps;
        return steps[stepId];
    },
    updateStep: (stepId: string, step: FormStep) => {
        set(state => {
            const existingField = state.steps[stepId];
            if (!existingField) {
                // @ts-ignore
                return {
                    steps: {
                        ...state.steps,
                        [stepId]: {...step} as FormStep,
                    },
                };
            }
            // @ts-ignore
            const updatedStep = {...existingField, ...step};
            return {
                steps: {
                    ...state.steps,
                    [stepId]: updatedStep,
                },
            };
        })
    },
    // form
    form: {},
    setForm: (form: any) => set({form: form}),
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
}));
