import { useFormStore, type IField } from "../store/useFormStore.ts";
import {useCascadeStore} from "../store/useCascadeStore.ts";

export const useCascadeDropDown = () => {
    const store = useFormStore(state => state);
    const cascadeStore = useCascadeStore();

    const setLoadingForLoadDataFields = (loading: boolean, form: any, field?: IField) => {
        if (!field || !field.config?.loadData) return;

        for (const childId of field.config.loadData) {
            store.updateField(childId, { loading });
            if (loading) {
                form.setFieldValue(childId, null);
                store.updateFieldConfig(childId, { data: [] });
            }
            const childField = store.fields[childId];
            setLoadingForLoadDataFields(loading, form, childField);
        }
    };

    const cascadeDropDown = async (target: string, source: string, value: any, form: any) => {
        const field = store.fields[target];

        if (!field) return;

        if (value == null) {
            setLoadingForLoadDataFields(false, form, field);
            return;
        }

        setLoadingForLoadDataFields(true, form, field);
        store.updateFieldConfig(target, { data: [] });
        store.updateField(target, { loading: true });

        // Use the loader function from the store if set
        let data: any[] = [];
        const loader = cascadeStore.getLoader();
        if (loader) {
            data = await loader({ target, source, value });
        }
        store.updateFieldConfig(target, { data });
        store.updateField(target, { loading: false });

        if (data.length === 1) {
            form.setFieldValue(target, data[0].value);
            value = data[0].value;
        } else {
            form.setFieldValue(target, null);
            value = null;
        }

        setLoadingForLoadDataFields(false, form, field);

        for (const child of field?.config?.loadData ?? []) {
            await cascadeDropDown(child, target, value, form);
        }
    };

    return cascadeDropDown;
};
