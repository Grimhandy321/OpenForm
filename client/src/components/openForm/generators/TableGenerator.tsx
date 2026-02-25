import {type FC, useCallback, useState } from "react";
import { useTranslator } from "../hooks/translator.ts";
import { useAxiosClient } from "../../api/axios-client.tsx";
import { ExpressionEvaluator } from "../store/ExpressionEvaluator.ts";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { Button, Text, Table, Group, Modal, ScrollArea } from "@mantine/core";
import { GenerateEditForm } from "./TableFormGenerator.tsx";
import { useFormStore } from "../store/useFormStore.ts";

export const TableGenerator: FC<{ fieldId: string }> = ({ fieldId }) => {
    const { tr } = useTranslator();
    const field = useFormStore((state) => state.fields[fieldId]);
    const form = useFormStore((state) => state.form);
    const [openForm, setOpenForm] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const axiosClient = useAxiosClient();
    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => updateState({}), []);
    const evaluator = new ExpressionEvaluator();

    if (!field) return null;

    const dateColIds = field.config?.cols
        ?.filter((col) => col.type === "DATE")
        .map((col) => col.id) ?? [];

    const defaultEditItem = field.config?.cols?.reduce((acc, item) => {
        acc[item.id] = item.default ?? "";
        return acc;
    }, {} as Record<string, any>);

    const handleCancelEdit = () => {
        setOpenForm(false);
        setEditItem(null);
    };

    const generateUniqueId = (): number => {
        const existingIds = new Set<number>((form.values[fieldId] ?? []).map((item: any) => item.id));
        let newId: number;
        do {
            newId = Math.floor(Math.random() * 1000000);
        } while (existingIds.has(newId));
        return newId;
    };

    const enterEdit = (item: any) => {
        setOpenForm(true);
        setEditItem(item);
    };

    const createRecord = () => {
        enterEdit({ ...defaultEditItem, created: true });
    };

    const handleSubmit = async (event: any) => {
        if (field.config?.action) {
            const formData = new FormData();

            Object.entries(event).forEach(([key, value]) => {
                if (value instanceof Date) {
                    formData.append(key, Math.floor(value.getTime() / 1000).toString());
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else if (value && typeof value === "object" && "value" in value) {
                    formData.append(key, (value.value ?? "invalid").toString());
                } else {
                    formData.append(key, value !== undefined && value !== null ? value.toString() : "");
                }
            });

            try {
                const response = await axiosClient.post(field.config.action, formData);
                form.setFieldValue(fieldId, response.data ?? []);
                //@ts-ignore
                showNotification({ title: tr("success"), icon: <IconCheck />, autoClose: 5000 });
            } catch (error: any) {
                const status = error?.response?.status;
                if (status === 500) {
                    //@ts-ignore
                    showNotification({ title: tr("server.error"), color: "red", icon: <IconCheck />, autoClose: 5000 });
                } else if (status === 422) {
                    Object.keys(error?.response?.data?.errors ?? {}).forEach((key) => {
                        //@ts-ignore
                        showNotification({
                            title: tr(`${key}.error`),
                            color: "red",
                            icon: <IconCheck />,
                            autoClose: 5000,
                        });
                    });
                }
            } finally {
                setOpenForm(false);
                setEditItem(null);
            }
        } else {
            // local edit
            const newData = (form.values[fieldId] ?? []).map((item: any) => (event.id === item.id ? event : item));
            if (event.created) {
                event.id = generateUniqueId();
                delete event.created;
                newData.push(event);
            }
            form.setFieldValue(fieldId, newData);
            forceUpdate();
            setOpenForm(false);
            setEditItem(null);
        }
    };

    const data: any[] = (field.state === "VIEWONLY" ? field.value ?? [] : form.values[fieldId] ?? []).map((item: any) => {
        dateColIds.forEach((id) => {
            if (id && typeof item[id] !== "object") item[id] = new Date(item[id] * 1000);
        });
        return item;
    });

    // @ts-ignore
    return (
        <>
            <ScrollArea style={{ maxHeight: 400 }}>
                <Table striped highlightOnHover>
                    <thead>
                    <tr>
                        {field.config?.cols?.map((col, index) =>
                            col.state !== "HIDDEN" ? (
                                <th key={index}>{tr(`column.${col.id}.title`)}</th>
                            ) : null
                        )}
                        {(field.state === "EDITABLE" || field.state === "ADDABLE") && <th>{tr("table.actions")}</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            {field.config?.cols?.map((col, colIndex) => {
                                if (col.state === "HIDDEN") return null;
                                let val = item[col.id];
                                if (col.state === "VIEWONLY" && col.expression) {
                                    val = evaluator.evaluate(col.expression ?? "", item);
                                } else if (col.type === "DATE" && val instanceof Date) {
                                    val = val.toLocaleDateString();
                                }
                                return <td key={colIndex}>{val}</td>;
                            })}
                            {(field.state === "EDITABLE" || field.state === "ADDABLE") && (
                                <td>
                                    <Group >
                                        <Button size="xs" onClick={() => enterEdit(item)}>
                                            {tr("edit")}
                                        </Button>
                                        <Button
                                            size="xs"
                                            color="red"
                                            onClick={() => {
                                                const index = form.values[fieldId].findIndex((i: any) => i.id === item.id);
                                                if (index !== -1) form.removeListItem(fieldId, index);
                                                forceUpdate();
                                            }}
                                        >
                                            {tr("delete")}
                                        </Button>
                                    </Group>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </ScrollArea>

            {(field.state === "EDITABLE" || field.state === "ADDABLE") && (
                <Button mt="sm" color="green" size="xs" onClick={createRecord}>
                    {tr("table.add.record")}
                </Button>
            )}

            <Modal opened={openForm} onClose={handleCancelEdit} title={tr("edit.record")} size="lg">
                {editItem && (
                    <GenerateEditForm item={editItem} fieldId={fieldId} onSubmit={handleSubmit} cancelEdit={handleCancelEdit} />
                )}
            </Modal>

            {field.error && (
                <Text color="red" size="sm" mt="xs">
                    {field.error}
                </Text>
            )}
        </>
    );
};
