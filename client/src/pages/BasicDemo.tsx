import {useComponentsStore} from "../components/openForm/store/useComponentsStore.ts";
import {useEffect} from "react";
import {Checkbox, ColorPicker, NumberInput, Textarea, TextInput} from "@mantine/core";
import CustomSelect from "../components/openForm/componets/CustomSelect.tsx";
import FormatedDateInput from "../components/openForm/componets/FormatedDateInput.tsx";
import {useFormStore} from "../components/openForm/store/useFormStore.ts";
import {useForm} from "@mantine/form";
import {TableGenerator} from "../components/openForm/generators/TableGenerator.tsx";

export const BasicDemo = () => {
    const setComponents = useComponentsStore((s) => s.setComponents);
    const {setForm} = useFormStore((s) => s);
    const form = useForm();

    useEffect(() => {
        setComponents({
            NUMBER: (props) => <NumberInput {...props} />,
            TEXT: (props) => <TextInput {...props} />,
            STRING: (props) => <TextInput {...props} />,
            TEXTAREA: (props) => <Textarea {...props} autosize/>,
            SELECT: (props) => <CustomSelect {...props} />,
            DATE: (props) => <FormatedDateInput {...props} />,
            BOOLEAN: (props) => <Checkbox {...props} />,
            TABLE: (props) => <TableGenerator {...props} />,
            CUSTOM: {
                ColorPicker: (props) => <ColorPicker {...props} />,
            },
        });
        setForm(form)
    }, [setComponents]);


    return (<>{"asd"}</>);

}
