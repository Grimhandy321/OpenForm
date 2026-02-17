import {useFormStore} from "../store/useFormStore.ts";
import {useDropdownStore} from "../store/useDropDownStore.ts";
import {useCallback, useState} from "react";

export const  useCascadeDropDown = () => {
  /*  const store = useFormStore();
    const dropdownData = useDropdownStore();
    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);
  //  const axiosClient = useAxiosClient();

    const cascadeDropDown = async (target: string, source: string, value: any,fieldId: string,form: any) => {
       /* const field = store.getField(target);
        const loadData = field?.config?.loadData;
        console.debug("Cascade: " + source + " : " + value + "  " + target)
        if (value == null) {
            form.setFieldValue(target, null);
            dropdownData.clearDropdownData(target);
        }

        if ((target != fieldId) && (value != null)) {
            dropdownData.clearDropdownData(target);
            form.setFieldValue(target, null);
         /*   const response = await axiosClient.post("/config/getDropDownData", {
                fieldId: source,
                value,
                target,
            },);
            dropdownData.setDropdownData(target, response?.data ?? [])
            if (response?.data.length === 1) {
                form.setFieldValue(target, response?.data[0].value);
                value = response?.data[0].value;
                forceUpdate();
            } else {
                value = null;
            }
        }

        if (!loadData) return;
        if (loadData?.length == 0) return;

        loadData.forEach((item) => {
            cascadeDropDown(item, target, value,"",form);
        });*/
    };

    return cascadeDropDown;
}
