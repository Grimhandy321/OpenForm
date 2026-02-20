import type {MantineColor} from "@mantine/core";

export interface IFormStepper {
    steps: string[];
    currentStep: number;
}

export interface ITableFieldSelectItem {
    id: string,
    label: string,
}

export interface IFormButton {
    id: string;
    value: string;
    color?: MantineColor;
}
export interface SelectItem{
    value: string | number | null;
    label: string | null;
    data? : {
        [p:string] : string
    }
}

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
export interface FieldConfig<TValue = any, TData = any> {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    data?: TData;
    value?: TValue;
    readOnly?: boolean;
    onChange?: (event?: any, value?: TValue) => void;
    error?: string | undefined;
    maxDate?: Date;
    minDate?: Date;
    clearable?: boolean;
    checked?: boolean;
    dataLoading?: boolean;
    form?: any;
}

import type { FC } from "react";

export type FieldComponents = {
    NUMBER: FC<FieldConfig<number>>;
    TEXT: FC<FieldConfig<string>>;
    STRING: FC<FieldConfig<string>>;
    TEXTAREA: FC<FieldConfig<string>>;
    SELECT: FC<FieldConfig<string, SelectItem[]>>;
    DATE: FC<FieldConfig<Date>>;
    BOOLEAN: FC<FieldConfig<boolean>>;
    CUSTOM: Record<string, FC<FieldConfig<any>>>;
    TABLE: FC<FieldConfig<any>>;
};
