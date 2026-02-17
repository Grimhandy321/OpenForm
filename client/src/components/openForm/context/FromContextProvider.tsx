import {useState} from "react";
import {FormContext} from "./FormContext.tsx";


export const FromContextProvider = ({...props}) => {
    const [value, setValue] = useState(null);
    return <FormContext.Provider value={{value, setValue}} {...props}/>
}