import {type FC,  useCallback, useEffect, useState} from "react";
import {type FormDefinition, useFormStore} from "../store/useFormStore.ts";
import {type FieldComponents, useComponentsStore} from "../store/useComponentsStore.tsx";
import {ExpressionEvaluator} from "../store/ExpressionEvaluator.ts";
import {formatToUTCDate} from "../helpers.ts";
import type {FieldConfig, FormGroup} from "../types.ts";
import {useCascadeDropDown} from "../hooks/useCascadeDropDown.ts";
import {FormInputElementWraper} from "../componets/FormInputElementWraper.tsx";
import {Grid} from "@mantine/core";
import {useForm} from "@mantine/form";

export const GenerateField: FC<{ fieldId: string }> = ({ fieldId }) => {
    const { fields, form } = useFormStore();
    const { components } = useComponentsStore();

    const field = fields[fieldId];
    if (!field || !form) return null;

    const inputProps = FieldProps(fieldId);

    if (field.type === "CUSTOM") {
        const CustomComponent = components.CUSTOM[field.component || "default"];
        if (!CustomComponent) return null;
        return <CustomComponent {...inputProps} form={form} />;
    }

    const FieldComponent = components[field.type] || components.TEXT;
    return <FieldComponent {...inputProps} orm={form} />;
};



export function FieldProps(fieldId: string): any {
    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);
    const cascadeDropdown = useCascadeDropDown();
    const field = useFormStore(state => state.fields[fieldId]);
    const form = useFormStore(state => state.form);

    if (!field) {
        return {style: {display: "none"}};
    }
    if (field?.state === "HIDDEN") {
        return {style: {display: "none"}};
    }
    const returnData: FieldConfig = {
        label: fieldId + ".label",
        placeholder: (field.state === "VIEW") ? "" :fieldId + ".placeholder",
        disabled: field.state === "VIEW",
        readOnly: field.state === "VIEW",
        error: field.error ? field.error : form.errors[fieldId] ? form.errors[fieldId] : undefined,
        dataLoading: field.loading ?? false,
        onChange: () => {
        } // No-op for VIEW state
    };
    const value = form.values[fieldId];
    switch (field.type) {
        case "SELECT":
            returnData.placeholder = 'select.placeholer';
            returnData.data = field?.config?.data ?? [];
            returnData.disabled = returnData?.data?.length == 0;
            returnData.onChange = (value: any, setData?: any) => {
                //  setValue(value);
                const loadData = field.config?.loadData;
                form.setFieldValue(fieldId, value);

                if (loadData) {
                    form.getInputProps(fieldId).onChange(value);
                    loadData.forEach(async (item: string) => {
                        await cascadeDropdown(item, fieldId, value,form);
                    })
                }
                if (setData) {
                    Object.keys(setData).forEach((key: string) => {
                        form.setFieldValue(key, setData[key]);
                    })
                }
            };

            break;
        case "DATE":
            returnData.onChange = (value: Date | null) => {
                if(value === null){
                    form.setFieldValue(fieldId, value);
                }
                else {
                    form.setFieldValue(fieldId, formatToUTCDate(new Date(value)));
                }
            }
            returnData.clearable = true;
            returnData.maxDate = field?.config?.max ? new Date(field.config.max * 1000) : undefined;
            returnData.minDate = field?.config?.min ? new Date(field.config.min * 1000) : undefined;
            break;
        case "NUMBER":
            // @ts-ignore
            returnData.onChange = (value: any) => {
                if (/^\d*$/.test(value)) {
                    if (field?.config?.min) {
                        if (value < field?.config?.min) {
                            return;
                        }
                    }
                    if (field?.config?.max) {
                        if (value > field?.config?.max) {
                            return;
                        }
                    }
                    form.values[fieldId] = value;
                    forceUpdate();
                }
            };
            break;
        case "BOOLEAN":
            returnData.checked = value;
            returnData.onChange = (event: any) => {
                if (field.config?.hides) {
                    field.config?.hides.map((item) => {
                        setGroupHidden(item, event?.currentTarget?.checked)
                    })
                }
                form.values[fieldId] = event?.currentTarget?.checked;
            };
            break;
        case "TEXT":
        case "STRING":
            returnData.onChange = (event) => {
                const inputValue = event.target.value as string;
                if (field?.config?.max) {
                    if (inputValue.length > field?.config?.max) {
                        return;
                    }
                }
                form.values[fieldId] = inputValue;
                forceUpdate();
            }
            break;
        default:
            returnData.onChange = (event: any) => {
                form.values[fieldId] = event?.currentTarget?.value;
                forceUpdate();
            };
            break;
    }

    if (field?.state === "VIEWONLY") {
        const evaluator = new ExpressionEvaluator();
        let value = field.value ? field?.type === "DATE" ? new Date(field.value as number * 1000) : field.value : "";

        if (field.expression) {
            value = evaluator.evaluate(field.expression, form.values) ?? "naN";
        }

        return {
            label: fieldId + ".label",
            placeholder:  fieldId + ".placeholder",
            disabled: true,
            value: value,
        };
    }

    return {
        value: value ?? undefined,
        ...returnData,
    };
}


const setGroupHidden = (groupId: string, hidden: boolean) => {
    const store = useFormStore();
    Object.keys(store.steps).map((key) => {
        const step = store.steps[key];
        Object.keys(step).map((index: string) => {
            if (index == groupId) {
                // @ts-ignore
                step[index].state = !hidden ? "HIDDEN" : "VIEW";
                store.updateStep(key, step);
            }
            return;
        });
    });
}

export const GenerateGroup: FC<{ group: FormGroup}> = (props) => {
    const group = props.group
    if (group.state === "HIDDEN") {
        return <></>
    }

    return (
        <FormInputElementWraper colls={group.config?.colls} title={group.config?.title}
                                collabsable={group.config?.collabsable ?? false}>
            {group?.value?.map((field) => {
                return <GenerateField key={field} fieldId={field}/>
            })}
        </FormInputElementWraper>);
}

export const FormGenerator: FC<{definition:FormDefinition,components?:FieldComponents}> = ({definition,components}) => {
    const [columns, setColumns] = useState(12);
    const store = useFormStore();
    const componentsStore = useComponentsStore();
    const form = useForm({});



    const groups = store.groups ?? {}

    useEffect(() => {
        componentsStore.updateComponents(components ?? {});
        store.initializeFrom(form,definition);
        function updateColumns() {
            if (window.innerWidth < 1000) {
                setColumns(6);
            } else if (window.innerWidth < 1750) {
                setColumns(12);
            } else {
                setColumns(18);
            }
        }

        window.addEventListener('resize', updateColumns);
        updateColumns();

        return () => window.removeEventListener('resize', updateColumns);
    }, []);


    return (
        <Grid
            type={"media"}
            columns={columns}
            gutter={'xs'}
        >
            {Object.entries(groups).map(([index, value]) => {
                return value.value?.some(key => Object.keys(store.fields).includes(key)) &&
                    <GenerateGroup key={index} group={value} />
            })}
        </Grid>
    );
}

