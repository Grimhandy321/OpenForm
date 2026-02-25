import {type FC, useState} from "react";
import { useTranslator } from "../hooks/translator.ts";
import { Button, TextInput, NumberInput, Group,  FileInput, Modal } from "@mantine/core";
import { Spinner } from "react-spinner-toolkit";
import type {EditForm} from "../types.ts";
import { useFormStore } from "../store/useFormStore.ts";
import CustomSelect from "../componets/CustomSelect.tsx";
import FormatedDateInput from "../componets/FormatedDateInput.tsx";

export const GenerateEditForm: FC<EditForm> = ({ item, cancelEdit, onSubmit, fieldId }) => {
    const { tr } = useTranslator();
    const field = useFormStore((state) => state.fields[fieldId]);
    const [formValues, setFormValues] = useState<any>({ ...item });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!field) return null;

    const handleChange = (id: string, value: any) => {
        setFormValues((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(formValues);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            opened={true}
            onClose={() => cancelEdit(item)}
            title={item?.created ? tr("table.add.record") : tr("table.edit.record")}
            size="lg"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                {field.config?.cols?.map((col, index) => {
                    if (col.state !== "EDITABLE") return null;

                    const value = formValues[col.id];
                    const label = tr(`column.${col.id}.title`);

                    switch (col.type) {
                        case "FILE":
                            return (
                                <FileInput
                                    key={index}
                                    label={label}
                                    value={value}
                                    onChange={(val) => handleChange(col.id, val)}
                                />
                            );

                        case "DATE":
                            return (
                                <FormatedDateInput
                                    key={index}
                                    label={label}
                                    value={value instanceof Date ? value : value ? new Date(value * 1000) : null}
                                    minDate={col.min ? new Date(col.min * 1000) : undefined}
                                    maxDate={col.max ? new Date(col.max * 1000) : undefined}
                                    onChange={(val:any) => handleChange(col.id, val)}
                                />
                            );

                        case "SELECT":
                            return (
                                <CustomSelect
                                    key={index}
                                    label={label}
                                    value={value?.value ?? value}
                                    data={col.data ?? []}
                                    onChange={(val) => handleChange(col.id, val)}
                                />
                            );

                        case "NUMBER":
                            return (
                                <NumberInput
                                    key={index}
                                    label={label}
                                    value={value}
                                    min={col.min}
                                    max={col.max}
                                    onChange={(val) => handleChange(col.id, val)}
                                />
                            );

                        default:
                            return (
                                <TextInput
                                    key={index}
                                    label={label}
                                    value={value ?? ""}
                                    onChange={(e) => handleChange(col.id, e.currentTarget.value)}
                                />
                            );
                    }
                })}

                <Group  justify="space-between"  mt="md">
                    <Button
                        type="submit"
                        color={item.created ? "green" : undefined}
                        leftSection={isSubmitting && <Spinner size={25} color="#007aff" loading />}
                        disabled={isSubmitting}
                    >
                        {item.created ? tr("table.add.record") : tr("table.update.record")}
                    </Button>

                    <Button color="red" onClick={() => cancelEdit(item)}>
                        {tr("edit.cancel")}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};
