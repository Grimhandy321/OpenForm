import type { FieldConfig, SelectItem } from "../types.ts";
import { type ComboboxItem, Select } from "@mantine/core";

interface CustomSelectProps extends Omit<FieldConfig, "data" | "value" | "onChange"> {
    data?: SelectItem[];
    value?: string | number | null;
    onChange?: (value: string | number | null, option?: any) => void;
    dataloading?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       data = [],
                                                       value = null,
                                                       onChange = () => {},
                                                       dataloading = false, // default false
                                                       ...rest
                                                   }) => {
    const stringValue = value !== null && value !== undefined ? String(value) : null;

    const handleChange = (_value: string | null) => {
        if (_value === null) {
            onChange(null);
            return;
        }

        const selectedItem = data.find((item) => String(item.value) === _value);
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

    return (
        <Select
            {...rest}
            data={data.map((item: SelectItem) => ({
                label: item.label,
                value: String(item.value),
            })) as ComboboxItem[]}
            value={stringValue as string}
            onChange={handleChange}
            allowDeselect={false}
        />
    );
};

export default CustomSelect;
