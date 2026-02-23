import {useTranslator} from "../hooks/translator.ts";
import type { ITableColl} from "../types.ts";
import {type FC, useCallback, useState} from "react";
import {useAxiosClient} from "../../api/axios-client.tsx";
import {ExpressionEvaluator} from "../store/ExpressionEvaluator.ts";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import {
    Grid,
    type GridColumnProps,
    type GridCustomCellProps,
    type GridCustomFooterCellProps,
    GridColumn as Column,
    GridToolbar
} from "@progress/kendo-react-grid";
import {Button,Text} from "@mantine/core";
import {formatNumber} from "@progress/kendo-intl";
import {IntlProvider} from "@progress/kendo-react-intl";
import {EditCommandCell} from "../componets/Cells/EditCommandCell.tsx";
import {GenerateEditForm} from "./TableFormGenerator.tsx";
import {useFormStore} from "../store/useFormStore.ts";


export const TableGenerator: FC<{ fieldId: string }> = ({ fieldId}) => {
    const {tr} = useTranslator();
    const field = useFormStore(state => state.fields[fieldId]);
    const form = useFormStore(state => state.form);
    const dateColId = field?.config?.cols
        ?.filter((col: ITableColl) => col.type === "DATE")
        .map((col: ITableColl) => col.id);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<any | null>({});
    const axiosClient = useAxiosClient();
    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);
    const evaluator = new ExpressionEvaluator();
    const defaultEditItem = field?.config?.cols?.reduce((acc, item) => {
        return {
            ...acc,
            [item.id]: item.default
        }
    }, {});

    const MyEditCommandCell = (props: GridCustomCellProps) => (
        <EditCommandCell {...props}
                         handleDelete={(item: any) => {
                             if (field.config?.action) {
                                 axiosClient.delete(field.config.action + "/" + item.id)
                                     .then((response) => {
                                         form.setFieldValue(fieldId, response.data ?? []);
                                         showNotification({
                                             title: tr("success"),
                                             icon: <IconCheck/>,
                                             message: "",
                                             autoClose: 5000,
                                         });
                                         forceUpdate();
                                     })
                                     .catch((error) => {
                                         console.error("Error deleting data:", error);
                                     }).finally(() => {
                                     setOpenForm(false);
                                     setEditItem({});
                                 });
                             } else {

                                 const num: number = form.values[fieldId].findIndex((obj: any) => obj.id === item.id);
                                 if (num !== -1) {
                                     form.removeListItem(fieldId, num)
                                 }
                             }
                         }}
                         enterEdit={(item: any) => {
                             setOpenForm(true);
                             setEditItem(item);
                         }}/>
    );

    const handleCancelEdit = (_item: any | null) => {
        setOpenForm(false)
        setEditItem({})
    };


    const handleSubmit = (event: any) => {
        if (field.config?.action) {
            const formData = new FormData();
            Object.entries(event).map(([key, value]) => {

                if (value instanceof Date) {
                    // @ts-ignore
                    formData.append(key, value ? (Date.parse(value.toDateString()) / 1000) : 0);
                    return;
                }
                if (value instanceof File) {
                    formData.append(key, value);
                    return;
                }
                if (typeof value === "object") {
                    // @ts-ignore
                    formData.append(key, value?.value ?? "invalid option");
                    return;
                }

                // @ts-ignore
                formData.append(key, value);
            })


            axiosClient.post(field.config.action, formData)
                .then((response) => {
                    form.setFieldValue(fieldId, response.data ?? []);
                    showNotification({
                        title: tr("success"),
                        icon: <IconCheck/>,
                        message: "",
                        autoClose: 5000,
                    });
                    setOpenForm(false);
                    setEditItem({});
                })
                .catch((error) => {
                    setOpenForm(false);
                    setEditItem({});
                    if (error.response.status === 500) {
                        showNotification({
                            title: tr("server.error"),
                            icon: <IconCheck/>,
                            message: "",
                            color: 'red',
                            autoClose: 5000,
                        });
                    }
                    if (error.response.status === 422) {
                        Object.keys(error?.response?.data?.errors ?? {}).map((key: string) => {
                            showNotification({
                                title: tr("claim." + key + ".error"),
                                icon: <IconCheck/>,
                                message: "",
                                color: 'red',
                                autoClose: 5000,
                            });
                        });

                    }

                }).finally(() => {
                setOpenForm(false);
                setEditItem({});
            });
        } else {
            const newData = form.values[fieldId].map((item: any) => {
                if (event.id === item.id) {
                    return {...event};
                }
                return item;
            });

            if (event.created) {
                event.id = generateUniqueId();
                event.created = false;
                newData.push(event);
            }

            form.setFieldValue(fieldId, newData);
            forceUpdate();
            setOpenForm(false);
            setEditItem({});
        }
    };

    const generateUniqueId = (): number => {
        const existingIds = new Set<number>(form.values[fieldId].map((item: any) => item.id));
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
        enterEdit({...defaultEditItem, created: true})
    };

    const data: any[] = (field.state === "VIEWONLY" ? field.value ?? [] : (form.values[fieldId] ?? [])).map((item: any) => {
        (dateColId ?? []).map((id) => {
            id = id ?? "";
            if (typeof item[id] == "object") {
                return;
            }
            item[id] = new Date(item[id] * 1000);
        })
        return item;
    }) as any[];
    return <>
        <IntlProvider locale="en-GB">
            <Grid
                data={data}
                resizable={true}
                style={{
                    minHeight: "15.2em",
                    maxHeight: "30em"
                }}
                size={"small"}
            >
                {field.state != "VIEWONLY" && <GridToolbar>
                    <Button
                        size={"xs"}
                        color={"green"}
                        onClick={() => createRecord()}
                        disabled={!(field.state === "EDITABLE" || field.state === "ADDABLE")}
                    >
                        {tr("table.add.record")}
                    </Button>
                </GridToolbar>}
                {field?.config?.cols?.map((col: ITableColl, index) => {

                    if (col.state === "HIDDEN") {
                        return null;
                    }
                    const props: GridColumnProps = {
                        field: col.id,
                        title: tr(`column.${col.id}.title`),
                    }
                    if (col.type === "SELECT") {
                        props.field = col.id + ".label"
                    }

                    if (col.state === "VIEWONLY" && col.expression) {
                        props.cells = {
                            data: (props: GridCustomCellProps) => {
                                return (<td {...props.tdProps}>
                                    {formatNumber(evaluator.evaluate(col.expression ?? "", props.dataItem), "n2").toLocaleString()}
                                </td>);
                            },
                            footerCell: (props: GridCustomFooterCellProps) => {
                                if (!col.aggregate) {
                                    return null;
                                }
                                const summ: number = data.reduce((acc: number, item: any) => {
                                        return acc += evaluator.evaluate(col.expression ?? "", item);

                                    },
                                    0);
                                return (<td {...props.tdProps}>
                                    {formatNumber(summ, "n2").toLocaleString()}
                                </td>);
                            }
                        }
                    }
                    return (<Column {...props}
                                    key={index}
                                    format={col.type === "DATE" ? '{0:d}' : '{0:N2}'}
                    />)
                })
                }
                {field.state === "EDITABLE" &&
                    <Column width={80} locked={true} resizable={false} title={tr("table.actions")}
                            cells={{data: MyEditCommandCell}}/>}
            </Grid>
            {openForm &&
                <GenerateEditForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem}
                                  fieldId={fieldId}/>}
            {field.error && <Text c={"red"} size={"sm"}>{field.error}</Text>}
        </IntlProvider>
    </>
}
