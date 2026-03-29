
export interface SelectItem{
    value: string | number | null;
    label: string | null;
    data? : {
        [p:string] : string
    }
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
    dataloading?: boolean;
    form?: any;
    //  arbitrary props like style, className, id, etc.
    [key: string]: any;

}

export interface EditForm {
    item: {
        id: string
        created: boolean,
    },
    fieldId: string;
    cancelEdit: (item: {
        id: string
        created: boolean,
    } | null) => void;
    onSubmit: (event: any) => void;
}
