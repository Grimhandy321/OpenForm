import type {FieldRenderProps} from "@progress/kendo-react-form";
import {Error, Label} from "@progress/kendo-react-labels";
import {TextBox} from "@progress/kendo-react-inputs";

export const TextBoxField = (fieldRenderProps: FieldRenderProps) => {
    const {validationMessage, visited, label, id, valid, ...others} = fieldRenderProps;
    return (
        <>
            <Label editorId={id} editorValid={valid} className={'k-form-label'}>
                {label}
            </Label>
            <div className={'k-form-field-wrap'}>
                <TextBox {...others} />
                {visited && validationMessage && <Error>{validationMessage}</Error>}
            </div>
        </>
    );
};
