import {useTranslator} from "../../hooks/translator.ts";
import {useState} from "react";
import type {FieldRenderProps} from "@progress/kendo-react-form";
import {Error, Label} from "@progress/kendo-react-labels";
import {FileInput} from "@mantine/core";

export const SingleFileField = (fieldRenderProps: FieldRenderProps) => {
    const {validationMessage, visited, label, id, valid, onChange} = fieldRenderProps;
    const [value, setValue] = useState<File | null>(null);
    const {tr} = useTranslator();

    return (
        <>
            <Label editorId={id} editorValid={valid} className={'k-form-label'}>
                {label}
            </Label>
            <div className={'k-form-field-wrap'}>
                <FileInput
                    value={value}
                    onChange={(event) => {
                        console.log(event);
                        onChange({target: id, value: event});
                        setValue(event)
                    }}
                    placeholder={fieldRenderProps.value ?? tr("file.select.promt")}
                />
                {visited && validationMessage && <Error>{validationMessage}</Error>}
            </div>
        </>
    );
};
