import {useComponentsStore} from "../openForm/store/useComponentsStore.ts";
//import {useFormStore} from "../openForm/store/useFormStore.ts";
import {useEffect} from "react";
import {Checkbox, ColorPicker, NumberInput, Textarea, TextInput} from "@mantine/core";
import CustomSelect from "../openForm/componets/CustomSelect.tsx";
import FormatedDateInput from "../openForm/componets/FormatedDateInput.tsx";

export const BasicDemo = () => {
    const setComponents = useComponentsStore((s) => s.setComponents);
   // const {setForm} = useFormStore((s) => {setForm: s.setForm});


    useEffect(() => {
        setComponents({
            NUMBER: (props) => <NumberInput {...props} />,
        TEXT: (props) => <TextInput {...props} />,
        STRING: (props) => <TextInput {...props} />,
        TEXTAREA: (props) => <Textarea {...props} autosize />,
            SELECT: (props) => <CustomSelect {...props} />,
        DATE: (props) => <FormatedDateInput {...props} />,
        BOOLEAN: (props) => <Checkbox {...props} />,
        TABLE: (props) => <TableGenerator {...props} />,
        CUSTOM: {
            ColorPicker: (props) => <ColorPicker {...props} />,
        },
    });
    }, [setComponents]);


    return (<>{"asd"}</>);

}
