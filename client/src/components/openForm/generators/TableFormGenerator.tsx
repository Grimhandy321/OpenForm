import {useTranslator} from "../hooks/translator.ts";
import {useState} from "react";
import {Form, Field, FormElement, FieldWrapper} from '@progress/kendo-react-form';
import {Dialog, DialogActionsBar} from "@progress/kendo-react-dialogs";
import {Label} from "@progress/kendo-react-labels";
import {DropDownList} from "@progress/kendo-react-dropdowns";
import {NumericTextBox} from "@progress/kendo-react-inputs";
import {Button} from "@mantine/core";
import {Spinner} from "react-spinner-toolkit";
import {TextBoxField} from "../componets/Fields/TextBoxField.tsx";
import {DatePicker} from '@progress/kendo-react-dateinputs';
import {SingleFileField} from "../componets/Fields/SingleFileField.tsx";
import type {EditForm} from "../types.ts";

export const GenerateEditForm = (props: EditForm) => {
    const {item, field, cancelEdit, onSubmit} = props;
    const {tr} = useTranslator();
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

    return (
        <Form
            initialValues={item}
            onSubmit={onSubmit}
            render={(renderProps) => (
                <Dialog width={400} title={item?.created ? tr("table.add.record") : tr(`table.edit.record`)}
                        onClose={() => {
                            cancelEdit(item)
                        }}>
                    <FormElement>
                        {field.config?.cols?.map((col, index) => {
                            if (!(col.state == "EDITABLE")) {
                                return;
                            }
                            switch (col.type) {
                                case "FILE":
                                    return <FieldWrapper key={index}>
                                        <Field
                                            id={col.id}
                                            name={col.id ?? ''}
                                            label={tr(`column.${col.id}.title`)}
                                            component={SingleFileField}

                                        />
                                    </FieldWrapper>

                                case "DATE":
                                    return <FieldWrapper key={index}>
                                        <Field
                                            id={col.id}
                                            name={col.id ?? ''}
                                            label={tr(`column.${col.id}.title`)}
                                            component={DatePicker}
                                            min={col?.min ? new Date(col?.min * 1000) : undefined}
                                            max={col?.max ? new Date(col?.max * 1000) : undefined}
                                            format="dd/MM/yyyy"
                                            validator={
                                                (value: number | undefined | null | string) => {
                                                    if (value === undefined || value === null || value === "") {
                                                        return tr("table.error.null");
                                                    }
                                                    return undefined;
                                                }
                                            }
                                        />
                                    </FieldWrapper>


                                case "SELECT":
                                    return <FieldWrapper key={index}>
                                        <Label editorId={'col.id'} className={'k-form-label'}>
                                            {tr(`column.${col.id}.title`)}
                                        </Label>
                                        <Field
                                            id={col.id}
                                            name={col.id ?? ''}
                                            component={DropDownList}
                                            textField={'label'}
                                            data={ col.data ?? []}
                                            onChange={(event) => {
                                                Object.entries(event?.value?.data ?? {}).map(([key, value]) => {
                                                    renderProps.onChange(key, {value: value});
                                                });
                                            }}
                                            validator={
                                                (value: number | undefined | null | string) => {
                                                    if (value === undefined || value === null || value === "") {
                                                        return tr("table.error.null");
                                                    }
                                                    return undefined;
                                                }
                                            }
                                        />
                                    </FieldWrapper>
                                case "NUMBER":
                                    return <FieldWrapper key={index}>
                                        <Label editorId={'col.id'} className={'k-form-label'}>
                                            {tr(`column.${col.id}.title`)}
                                        </Label>
                                        <Field
                                            id={col.id}
                                            name={col.id ?? ''}
                                            component={NumericTextBox}
                                            min={col.min}
                                            max={col.max}
                                            validator={(value: number | undefined | null) => {
                                                if (value === undefined || value === null) {
                                                    return tr("table.error.null");
                                                }
                                                if (col.min !== undefined && col.min !== null) {
                                                    if (value < col.min) {
                                                        return tr("table.error.number.min");
                                                    }
                                                }
                                                if (col.max !== undefined && col.max !== null) {
                                                    if (value > col.max) {
                                                        return tr("table.error.number.max");
                                                    }
                                                }
                                                return undefined;
                                            }}
                                        />
                                    </FieldWrapper>
                                default:
                                    return <FieldWrapper key={index}>
                                        <Field
                                            id={col.id}
                                            name={col.id ?? ''}
                                            label={tr(`column.${col.id}.title`)}
                                            component={TextBoxField}
                                            validator={
                                                (value: number | undefined | null | string) => {
                                                    if (value === undefined || value === null || value === "") {
                                                        return tr("table.error.null");
                                                    }
                                                    return undefined;
                                                }
                                            }
                                        />
                                    </FieldWrapper>
                            }
                        })}
                    </FormElement>
                    <DialogActionsBar layout="start">
                        <Button
                            type={'submit'}
                            disabled={renderProps.allowSubmit}
                            onClick={(event) => {
                                if (!isSubmiting && renderProps.allowSubmit) {
                                    setIsSubmiting(true);
                                    renderProps.onSubmit(event);
                                }
                            }}
                            leftSection={isSubmiting && <Spinner
                                size={25}
                                color="#007aff"
                                loading={true}
                                shape="circle"
                            />}
                            color={item.created ? "green" : undefined}

                        >
                            {item.created ? tr("table.add.record") : tr("table.update.record")}
                        </Button>
                        <Button
                            color={"red"}
                            onClick={() => {
                                cancelEdit(item)
                            }}>
                            {tr("edit.cancel")}
                        </Button>
                    </DialogActionsBar>
                </Dialog>
            )
            }
        />);
}
