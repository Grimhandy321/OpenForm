import {create, type StoreApi, type UseBoundStore} from "zustand";
import type {MantineColor} from "@mantine/core";
import type {SelectItem} from "../types.ts";

export interface IField {
    state: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY" | "TABLE" | "ADDABLE" ;
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
export interface ITableColl {
    type: "NUMBER" | "SELECT" | "DATE" | "TEXT"  | "FILE",
    state: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY",
    data?: SelectItem[],
    loadData?: string[],
    id: string,
    expression?: string | null ,
    default?: string | number;
    min?: number,
    max?: number,
    aggregate?: boolean,
    link?: string
}

export type FormGroup = {
    state?: "EDITABLE" | "HIDDEN";
    type: "GROUP" | "TABS";
    value: string[]| Record<string, string[]>; // FieldIds
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

export interface TFormStore {
    // Steps
    steps: FormSteps
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
    // button:
    buttons: Button[];
    setButtons: (buttons: Button[]) => void;
    // csrf
    csrfToken: string;
    setCsrfToken: (token: string) => void;

    initializeFrom: (
        data: FormDefinition
    ) => void;
}

export type FormDefinition = {
    fields: Record<string, IField>;
    buttons: Button[];
    steps?: FormSteps;
    groups: Record<string, FormGroup>;
};


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
    // buttons
    buttons: [],
    setButtons: (buttons: Button[]) => set({buttons : buttons}),
    // alertes
    //
    groups: {},
    setGroups: (groups: Record<string, FormGroup>) => set({groups : groups}),
    // csrf
    csrfToken: "",
    setCsrfToken: (token: string) => set({csrfToken:token}),

    initializeFrom: (data) => {
        set({
            fields: data.fields,
            buttons: data.buttons,
            groups: data.groups,
            steps:data.steps
        });


    },
}));



