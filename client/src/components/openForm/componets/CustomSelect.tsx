import type {FieldConfig, SelectItem} from "../types.ts";
import {type ComboboxItem, Select} from "@mantine/core";
import {Spinner} from "react-spinner-toolkit";

interface CustomSelectProps extends Omit<FieldConfig, 'data' | 'value' | 'onChange'> {
    data?: SelectItem[];
    value?: string | number | null;
    fieldId: string;
    onChange?: (value: string | number | null, option?: any) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       data = [],
                                                       value = null,
                                                       onChange = () => {
                                                       },
                                                       fieldId,
                                                       ...rest
                                                   }) => {
    const stringValue = value !== null && value !== undefined ? String(value) : null;
    const handleChange = (_value: string | null) => {
        if (_value === null) {
            onChange(null);
            return;
        }

        const selectedItem = data.find(item => String(item.value) === _value);
        let setData: any = undefined;
        if (selectedItem?.data) {
            setData = selectedItem.data;
        }

        const parsedNumber = Number(_value);
        if (!isNaN(parsedNumber) && data.some((item) => item.value === parsedNumber)) {
            onChange(parsedNumber, setData);
        } else {
            onChange(_value, setData);
        }
    };


    try {
        return (
            <Select
                {...rest}
                data={data.map((item: SelectItem) => ({
                    label: item.label,
                    value: String(item.value)
                }))as ComboboxItem[]}
                value={stringValue as string}
                onChange={handleChange}
                rightSection={((data ?? []).length > 0 ? (data ??  []).length :
                    rest.dataLoading ? <Spinner
                        size={25}
                        color="#007aff"
                        loading={true}
                        shape="circle"
                    /> : undefined)
                }
                allowDeselect={false}
            />
        );
    } catch (error) {
        console.error('CustomSelect rendering error:', error);
        // @ts-ignore
        return <Select {...rest} disabled error={error}/>;
    }
};

export default CustomSelect;
