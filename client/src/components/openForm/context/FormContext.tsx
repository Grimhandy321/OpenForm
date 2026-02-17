import {
    createContext,
    useContext
} from "react";

export interface IClaimFormContext {
    value :any
    setValue(value: any): void;
}

export const FormContext =createContext<IClaimFormContext>(null as any);


export const useFormContext = () => useContext(FormContext);


