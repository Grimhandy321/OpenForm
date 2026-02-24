import {type FC, useCallback, useEffect, useState} from "react";
import {type FormDefinition, useFormStore} from "../store/useFormStore.ts";
import {type FieldComponents, useComponentsStore} from "../store/useComponentsStore.tsx";
import {ExpressionEvaluator} from "../store/ExpressionEvaluator.ts";
import {formatToUTCDate} from "../helpers.ts";
import type {FieldConfig} from "../types.ts";
import {useCascadeDropDown} from "../hooks/useCascadeDropDown.ts";
import {FormInputElementWraper} from "../componets/FormInputElementWraper.tsx";
import {Box, Button, Container, Grid, Group, Paper, Tabs} from "@mantine/core";
import {useForm} from "@mantine/form";
import {StepFromGenerator} from "./StepFormGenerator.tsx";
import {useTranslator} from "../hooks/translator.ts";

export const GenerateField: FC<{ fieldId: string }> = ({fieldId}) => {
    const {fields, form} = useFormStore();
    const {components} = useComponentsStore();

    const field = fields[fieldId];
    if (!field || !form) return null;

    const inputProps = FieldProps(fieldId);

    if (field.type === "CUSTOM") {
        const CustomComponent = components.CUSTOM[field.component || "default"];
        if (!CustomComponent) return null;
        return <CustomComponent {...inputProps} form={form}/>;
    }

    const FieldComponent = components[field.type] || components.TEXT;
    return <FieldComponent {...inputProps} orm={form}/>;
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
        placeholder: (field.state === "VIEW") ? "" : fieldId + ".placeholder",
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
                        await cascadeDropdown(item, fieldId, value, form);
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
                if (value === null) {
                    form.setFieldValue(fieldId, value);
                } else {
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
            placeholder: fieldId + ".placeholder",
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
    Object.values(store.steps).map((groupIds) => {
        groupIds.map((index: string) => {
            if (index == groupId) {
                store.groups[index].state = hidden ? "HIDDEN" : "EDITABLE";
            }
            return;
        });
    });
}

export const GenerateGroup: FC<{ groupId: string }> = ({groupId}) => {
    const group = useFormStore().groups[groupId];
    const {tr} = useTranslator();
    if (group.state === "HIDDEN") {
        return <></>
    }

    if (group.type === "TABS") {
        const tabs = group.value as Record<string, string[]>;


        return (
            <Grid.Col span={{base: 12, sm: group?.config?.colls ?? 6}}>
                <Container px={"0.3em"} mx={"0px"} size={"1000rem"}>
                    <Paper my={"xs"} shadow={"xs"} withBorder>
                        <Tabs defaultValue={Object.keys(tabs)[0]} keepMounted={true}>
                            <Tabs.List>
                                {Object.keys(tabs).map((key) => {
                                    return (<Tabs.Tab key={key} value={key}>{tr(key)}</Tabs.Tab>);
                                })}
                            </Tabs.List>

                            {Object.entries(tabs).map(([key, value]) => {
                                return (<Tabs.Panel key={key} value={key}>
                                    {value.map((field: string) => {
                                        return <GenerateField key={field} fieldId={field}/>
                                    })}
                                </Tabs.Panel>);
                            })}
                        </Tabs>
                        );
                    </Paper>
                </Container>
            </Grid.Col>
        );
    }

    return (
        <FormInputElementWraper colls={group.config?.colls} title={group.config?.title ?? groupId}
                                collabsable={group.config?.collabsable ?? false}>
            {(group?.value as string[]).map((field: string) => {
                return <GenerateField key={field} fieldId={field}/>
            })}
        </FormInputElementWraper>);
}

export const FormGenerator: FC<{
    definition: FormDefinition,
    components?: FieldComponents,
    handleSubmit: (data: object, action?: string) => any,
}> = ({definition, components, handleSubmit}) => {
    const [columns, setColumns] = useState(12);
    const store = useFormStore();
    const componentsStore = useComponentsStore();
    const form = useForm({});


    const groups = store.groups ?? {}

    useEffect(() => {
        componentsStore.updateComponents(components ?? {});
        store.initializeFrom(form, definition);

        function updateColumns() {
            if (window.innerWidth < 1000) {
                setColumns(6);
            } else if (window.innerWidth < 1500) {
                setColumns(12);
            } else {
                setColumns(18);
            }
        }

        window.addEventListener('resize', updateColumns);
        updateColumns();

        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const submit = (values: any, action?: string) => {
        console.log("Form submitted:", values);
        console.log("Action:", action);

        handleSubmit(values, action);
    };

    if (Object.keys(store?.steps ?? {}).length === 0) {
        return (
            <Box>
                <Grid
                    type={"media"}
                    columns={columns}
                    gutter={'xs'}
                >
                    {Object.keys(groups).map((index) => {
                        return <GenerateGroup key={index} groupId={index}/>
                    })}
                </Grid>
                <Group mt="md">
                    {definition.buttons?.map((btn) => (
                        <Button
                            key={btn.id}
                            color={btn.color || "blue"}
                            type={btn.id === "submit" ? "submit" : "button"}
                            onClick={() => {
                                if (btn.id !== "submit") {
                                    submit(form.values, btn.id);
                                }
                            }}
                        >
                            {btn.value}
                        </Button>
                    ))}
                </Group>
            </Box>
        );
    } else {
        return (<Box>
            <StepFromGenerator handleSubmit={handleSubmit}/>
        </Box>);
    }
}

