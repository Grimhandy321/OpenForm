import {useFormStore} from "../store/useFormStore.ts";
import type {IField} from "../types.ts";
import {useAxiosClient} from "../../api/axios-client.tsx";

export const useCascadeDropDown = () => {
    const store = useFormStore(state => state);
    const axiosClient = useAxiosClient();

    const setLoadingForLoadDataFields = (loading: boolean, form: any, field?: IField) => {
        if (!field || !field.config?.loadData) {
            return;
        }
        for (const item of field.config.loadData) {
            store.updateField(item, {loading});
            if (loading) {
                form.setFieldValue(item, null);
                store.updateFieldConfig(item, {data: []});
            }
            const childField = store.fields[item];
            setLoadingForLoadDataFields(loading, form, childField);
        }
    };

    const cascadeDropDown = async (target: string, source: string, value: any, form: any) => {
        const field = store.fields[target];

        if (value == null) {
            setLoadingForLoadDataFields(false, form, field);
            return;
        }

        setLoadingForLoadDataFields(true, form, field);

        store.updateFieldConfig(target, {data: []});
        store.updateField(target, {loading: true});

        const response = await axiosClient.post("/config/getDropDownData", {
            fieldId: source,
            value,
            target,
        });

        store.updateFieldConfig(target, {data: response?.data ?? []});
        store.updateField(target, {loading: false});

        if (response?.data.length === 1) {
            form.setFieldValue(target, response.data[0].value);
            value = response.data[0].value;
        } else {
            form.setFieldValue(target, null);
            value = null;
        }
        setLoadingForLoadDataFields(false, form, field);

        for (const item of field?.config?.loadData ?? []) {
            await cascadeDropDown(item, target, value, form);
        }
    };

    return cascadeDropDown;
}
