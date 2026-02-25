import { type FC, useState, useEffect } from "react";
import { type FormDefinition, useFormStore } from "../store/useFormStore.ts";
import { type FieldComponents, useComponentsStore } from "../store/useComponentsStore.tsx";
import { ExpressionEvaluator } from "../store/ExpressionEvaluator.ts";
import { formatToUTCDate } from "../helpers.ts";
import type { FieldConfig } from "../types.ts";
import { useCascadeDropDown } from "../hooks/useCascadeDropDown.ts";
import { FormInputElementWraper } from "../componets/FormInputElementWraper.tsx";
import { Box, Button, Container, Grid, Group, Paper, Tabs } from "@mantine/core";
import { useForm } from "@mantine/form";
import { StepFromGenerator } from "./StepFormGenerator.tsx";
import { useTranslator } from "../hooks/translator.ts";

// ====================== HOOK: useFieldProps ======================
export const useFieldProps = (fieldId: string, form: ReturnType<typeof useForm>): FieldConfig => {
    const cascadeDropdown = useCascadeDropDown();
    const field = useFormStore((state) => state.fields[fieldId]);

    if (!field) return { style: { display: "none" } };
    if (field.state === "HIDDEN") return { style: { display: "none" } };

    const value = form.values[fieldId];

    const returnData: FieldConfig = {
        label: fieldId + ".label",
        placeholder: field.state === "VIEW" ? "" : fieldId + ".placeholder",
        disabled: field.state === "VIEW",
        readOnly: field.state === "VIEW",
        error: field.error ?? form.errors[fieldId] as string ?? undefined,
        dataloading:field.loading ? value : undefined,
        onChange: () => {}, // No-op for VIEW state
    };

    switch (field.type) {
        case "SELECT":
            returnData.placeholder = "select.placeholer";
            returnData.data = field.config?.data ?? [];
            returnData.disabled = returnData.data.length === 0;
            returnData.onChange = (val: any, setData?: any) => {
                form.setFieldValue(fieldId, val);
                if (field.config?.loadData) {
                    field.config.loadData.forEach(async (item) => {
                        await cascadeDropdown(item, fieldId, val, form);
                    });
                }
                if (setData) {
                    Object.keys(setData).forEach((key) => {
                        form.setFieldValue(key, setData[key]);
                    });
                }
            };
            break;

        case "DATE":
            returnData.onChange = (val: Date | null) => {
                form.setFieldValue(fieldId, val ? formatToUTCDate(new Date(val)) : null);
            };
            returnData.clearable = true;
            returnData.maxDate = field.config?.max ? new Date(field.config.max * 1000) : undefined;
            returnData.minDate = field.config?.min ? new Date(field.config.min * 1000) : undefined;
            break;

        case "NUMBER":
            returnData.onChange = (val: any) => {
                if (/^\d*$/.test(val)) {
                    if (field.config?.min && val < field.config.min) return;
                    if (field.config?.max && val > field.config.max) return;
                    form.setFieldValue(fieldId, val);
                }
            };
            break;

        case "BOOLEAN":
            returnData.checked = value;
            returnData.onChange = (event: any) => {
                const checked = event?.currentTarget?.checked;
                if (field.config?.hides) {
                    field.config.hides.forEach((item) => setGroupHidden(item, checked));
                }
                form.setFieldValue(fieldId, checked);
            };
            break;

        case "TEXT":
        case "STRING":
            returnData.onChange = (event: any) => {
                const inputValue = event.target.value as string;
                if (field.config?.max && inputValue.length > field.config.max) return;
                form.setFieldValue(fieldId, inputValue);
            };
            break;

        default:
            returnData.onChange = (event: any) => {
                form.setFieldValue(fieldId, event?.currentTarget?.value);
            };
            break;
    }

    if (field.state === "VIEWONLY") {
        const evaluator = new ExpressionEvaluator();
        let val =
            field.value !== undefined
                ? field.type === "DATE"
                    ? new Date(field.value as number * 1000)
                    : field.value
                : "";

        if (field.expression) {
            val = evaluator.evaluate(field.expression, form.values) ?? "naN";
        }

        return {
            label: fieldId + ".label",
            placeholder: fieldId + ".placeholder",
            disabled: true,
            value: val,
        };
    }

    return { value: value ?? undefined, ...returnData };
};

// ====================== FIELD COMPONENT ======================
export const GenerateField: FC<{ fieldId: string; form: ReturnType<typeof useForm> }> = ({ fieldId, form }) => {
    const { fields } = useFormStore();
    const { components } = useComponentsStore();

    const field = fields[fieldId];
    if (!field) return null;

    const inputProps = useFieldProps(fieldId, form);

    if (field.type === "CUSTOM") {
        const CustomComponent = components.CUSTOM[field.component || "default"];
        if (!CustomComponent) return null;
        return <CustomComponent {...inputProps} fieldId={fieldId} form={form} />;
    }

    const FieldComponent = components[field.type] || components.TEXT;
    return <FieldComponent {...inputProps} fieldId={fieldId} form={form} />;
};

// ====================== GROUP COMPONENT ======================
const setGroupHidden = (groupId: string, hidden: boolean) => {
    const store = useFormStore.getState();
    Object.values(store.steps).forEach((groupIds) => {
        groupIds.forEach((index: string) => {
            if (index === groupId) {
                store.groups[index].state = hidden ? "HIDDEN" : "EDITABLE";
            }
        });
    });
};

export const GenerateGroup: FC<{ groupId: string; form: ReturnType<typeof useForm> }> = ({ groupId, form }) => {
    const group = useFormStore().groups[groupId];
    const { tr } = useTranslator();

    if (!group || group.state === "HIDDEN") return null;

    if (group.type === "TABS") {
        const tabs = group.value as Record<string, string[]>;



        return (
            <Grid.Col span={{ base: 12, sm: group.config?.colls ?? 6 }}>
                <Container px="0.3em" mx="0px" size="1000rem">
                    <Paper my="xs" shadow="xs" withBorder>
                        <Tabs defaultValue={Object.keys(tabs)[0]} keepMounted>
                            <Tabs.List>
                                {Object.keys(tabs).map((key) => (
                                    <Tabs.Tab key={key} value={key}>
                                        {tr(key)}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>

                            {Object.entries(tabs).map(([key, value]) => (
                                <Tabs.Panel key={key} value={key}>
                                    {value.map((field: string) => (
                                        <GenerateField key={field} fieldId={field} form={form} />
                                    ))}
                                </Tabs.Panel>
                            ))}
                        </Tabs>
                    </Paper>
                </Container>
            </Grid.Col>
        );
    }

    return (
        <FormInputElementWraper
            colls={group.config?.colls}
            title={group.config?.title ?? groupId}
            collabsable={group.config?.collabsable ?? false}
        >
            {(group.value as string[]).map((field: string) => (
                <GenerateField key={field} fieldId={field} form={form} />
            ))}
        </FormInputElementWraper>
    );
};

// ====================== FORM GENERATOR ======================
export const FormGenerator: FC<{
    definition: FormDefinition;
    components?: FieldComponents;
    handleSubmit: (data: object, action?: string) => any;
}> = ({ definition, components, handleSubmit }) => {
    const [columns, setColumns] = useState(12);
    const store = useFormStore();
    const componentsStore = useComponentsStore();
    const groups = store.groups ?? {};
    const form = useForm({});


    // initialize
    useEffect(() => {

        componentsStore.updateComponents(components ?? {});
        store.initializeFrom( definition);

        for (const fieldId in definition.fields) {
            const field = definition.fields[fieldId];
            if (field.value && field.state !== "VIEWONLY") {
                if (field.type === "DATE" && typeof field.value === "number") {
                    form.setFieldValue(fieldId, formatToUTCDate(new Date(field.value * 1000)));
                } else {
                    form.setFieldValue(fieldId, field.value);
                }
            }

            if (fieldId === "csrf_token") {
                store.setCsrfToken((field.value as string) ?? "");
            }
        }

        function updateColumns() {
            if (window.innerWidth < 1000) setColumns(6);
            else if (window.innerWidth < 1500) setColumns(12);
            else setColumns(18);
        }

        window.addEventListener("resize", updateColumns);
        updateColumns();
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    const submit = (values: any, action?: string) => {
        handleSubmit(values, action);
    };

    if (!store.steps || Object.keys(store.steps).length === 0) {
        return (
            <Box>
                <Grid columns={columns} gutter="xs">
                    {Object.keys(groups).map((index) => (
                        <GenerateGroup key={index} groupId={index} form={form} />
                    ))}
                </Grid>
                <Group mt="md">
                    {definition.buttons?.map((btn) => (
                        <Button
                            key={btn.id}
                            color={btn.color || "blue"}
                            type={btn.id === "submit" ? "submit" : "button"}
                            onClick={() => {
                                if (btn.id !== "submit") submit(form.values, btn.id);
                            }}
                        >
                            {btn.value}
                        </Button>
                    ))}
                </Group>
            </Box>
        );
    } else {
        return (
            <Box>
                <StepFromGenerator handleSubmit={handleSubmit} form={form} />
            </Box>
        );
    }
};
