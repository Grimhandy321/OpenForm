import {type FC, useCallback, useState} from "react";
import {useTranslator} from "../hooks/translator.ts";
import {useAxiosClient} from "../../api/axios-client.tsx";
import {ExpressionEvaluator} from "../store/ExpressionEvaluator.ts";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import {Button, Text, Table, Group, Modal, ScrollArea} from "@mantine/core";
import {GenerateEditForm} from "./TableFormGenerator.tsx";
import {useFormStore} from "../store/useFormStore.ts";
import {useForm} from "@mantine/form";

export const TableGenerator: FC<{ fieldId: string,form: ReturnType<typeof useForm>}> = ({fieldId,form}) => {
    const {tr} = useTranslator();
    const field = useFormStore((s) => s.fields[fieldId]);

    const [openForm, setOpenForm] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);

    const axiosClient = useAxiosClient();
    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => updateState({}), []);
    const evaluator = new ExpressionEvaluator();

    if (!field) return null;

    const defaultItem =
        field.config?.cols?.reduce((acc, col) => {
            acc[col.id] = col.default ?? "";
            return acc;
        }, {} as Record<string, any>) ?? {};

    const openEditor = (item: any) => {
        setEditItem(item);
        setOpenForm(true);
    };

    const closeEditor = () => {
        setEditItem(null);
        setOpenForm(false);
    };

    const generateId = () => {
        const ids = new Set((form.values[fieldId] ?? []).map((i: any) => i.id));
        let id;
        do id = Math.floor(Math.random() * 1_000_000);
        while (ids.has(id));
        return id;
    };

    const handleSubmit = async (values: any) => {
        if (field.config?.action) {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof Date) {
                    formData.append(key, Math.floor(value.getTime() / 1000).toString());
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else if (value && typeof value === "object" && "value" in value) {
                    formData.append(key, String((value as any).value));
                } else {
                    formData.append(key, value != null ? String(value) : "");
                }
            });

            try {
                const res = await axiosClient.post(field.config.action, formData);
                form.setFieldValue(fieldId, res.data ?? []);
                //@ts-ignore
                showNotification({
                    title: tr("success"),
                    icon: <IconCheck/>,
                });
            } catch (err: any) {
                //@ts-ignore
                showNotification({
                    title: tr("server.error"),
                    color: "red",
                });
            } finally {
                closeEditor();
            }
        } else {
            const list = [...(form.values[fieldId] ?? [])];

            if (values.created) {
                values.id = generateId();
                delete values.created;
                list.push(values);
            } else {
                const i = list.findIndex((x) => x.id === values.id);
                if (i !== -1) list[i] = values;
            }

            form.setFieldValue(fieldId, list);
            forceUpdate();
            closeEditor();
        }
    };

    const removeRow = (item: any) => {
        const index = form.values[fieldId].findIndex((x: any) => x.id === item.id);
        if (index !== -1) form.removeListItem(fieldId, index);
        forceUpdate();
    };

    const rows = (
        field.state === "VIEWONLY"
            ? field.value ?? []
            : form.values[fieldId] ?? []
    ).map((item: any) => {
        const clone: any = { ...item };

        field.config?.cols?.forEach((col) => {
            const val = clone[col.id];
            if (val == null) return;

            if (col.type === "DATE") {
                if (val instanceof Date) return;

                if (typeof val === "number") {
                    clone[col.id] = new Date(val * 1000);
                    return;
                }

                if (typeof val === "string") {
                    const parsed = new Date(val);
                    if (!isNaN(parsed.getTime())) clone[col.id] = parsed;
                    return;
                }
            }

            if (col.type === "FILE") {
                if (val instanceof File) {
                    clone[col.id] = val.name;
                    return;
                }

                if (typeof val === "string") {
                    clone[col.id] = val.split("/").pop();
                    return;
                }
            }
            if (col.type === "SELECT") {
                if (typeof val === "object") {
                    clone[col.id] = val.label ?? val.value;
                    return;
                }

                // if backend returns raw value, map to label
                const option = col.data?.find((o: any) => o.value === val);
                if (option) clone[col.id] = option.label;
            }
        });

        return clone;
    });

    const aggregates: Record<string, number> = {};

    field.config?.cols?.forEach((col) => {
        if (!col.aggregate) return;

        aggregates[col.id] = rows.reduce((acc: number, row: any) => {
            let value = row[col.id];

            if (col.expression) {
                value = evaluator.evaluate(col.expression, row);
            }

            const num = Number(value);
            return acc + (isNaN(num) ? 0 : num);
        }, 0);
    });

    return (
        <>
            {(field.state === "EDITABLE" || field.state === "ADDABLE") && (
                <Button
                    mb="xs"
                    size="xs"
                    color="green"
                    onClick={() => openEditor({...defaultItem, created: true})}
                >
                    {tr("table.add.record")}
                </Button>
            )}

            <ScrollArea  mah={400} mih={220}>
                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            {field.config?.cols?.map(
                                (col) =>
                                    col.state !== "HIDDEN" && (
                                        <Table.Th key={col.id}>
                                            {tr(`column.${col.id}.title`)}
                                        </Table.Th>
                                    )
                            )}

                            {(field.state === "EDITABLE" ||
                                field.state === "ADDABLE") && (
                                <Table.Th>{tr("table.actions")}</Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {rows.map((row: any, rIndex: number) => (
                            <Table.Tr key={rIndex}>
                                {field.config?.cols?.map((col) => {
                                    if (col.state === "HIDDEN") return null;

                                    let value = row[col.id];

                                    if (col.state === "VIEWONLY" && col.expression) {
                                        value = evaluator.evaluate(
                                            col.expression,
                                            row
                                        );
                                    }

                                    if (col.type === "DATE" && value instanceof Date) {
                                        value = value.toLocaleDateString();
                                    }

                                    return <Table.Td key={col.id}>{value}</Table.Td>;
                                })}

                                {(field.state === "EDITABLE" ||
                                    field.state === "ADDABLE") && (
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Button
                                                size="xs"
                                                onClick={() => openEditor(row)}
                                            >
                                                {tr("edit")}
                                            </Button>
                                            <Button
                                                size="xs"
                                                color="red"
                                                onClick={() => removeRow(row)}
                                            >
                                                {tr("delete")}
                                            </Button>
                                        </Group>
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>

                    {Object.keys(aggregates).length > 0 && (
                        <Table.Tfoot>
                            <Table.Tr>
                                {field.config?.cols?.map((col) => {
                                    if (col.state === "HIDDEN") return null;

                                    if (!col.aggregate) {
                                        return <Table.Td key={col.id} />;
                                    }

                                    return (
                                        <Table.Td key={col.id}>
                                            <strong>
                                                {aggregates[col.id].toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </strong>
                                        </Table.Td>
                                    );
                                })}

                                {(field.state === "EDITABLE" ||
                                    field.state === "ADDABLE") && <Table.Td />}
                            </Table.Tr>
                        </Table.Tfoot>
                    )}
                </Table>
            </ScrollArea>


            <Modal
                opened={openForm}
                onClose={closeEditor}
                title={tr("edit.record")}
                size="lg"
            >
                {editItem && (
                    <GenerateEditForm
                        item={editItem}
                        fieldId={fieldId}
                        onSubmit={handleSubmit}
                        cancelEdit={closeEditor}
                    />
                )}
            </Modal>

            {field.error && (
                <Text c="red" size="sm" mt="xs">
                    {field.error}
                </Text>
            )}
        </>
    );
};
