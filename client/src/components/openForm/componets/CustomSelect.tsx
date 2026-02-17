import {type ComboboxItem, Select, type SelectProps} from "@mantine/core";
import {useEffect} from "react";
import type {SelectItem} from "../types.ts";

interface CustomSelectProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
    data?: SelectItem[];
    value?: string | number | null;
    onChange?: (value: string | number | null, option?: any ) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       data = [],
                                                       value = null,
                                                       onChange = () => {},
                                                       ...rest
                                                   }) => {
    const stringValue = value !== null && value !== undefined ? String(value) : null;
    const mantineData = data.map((item) => ({
        label: item.label,
        value: String(item?.value ?? ""),
    })) as  ComboboxItem[];

    if(hasDuplicateValues(mantineData)){
        console.log("invalid select data: ");
        console.log(mantineData);
        return <Select {...rest} disabled error={"Invalid Data"}/>;
    }
    useEffect(() => {
        if(mantineData.length === 1)
            handleChange(mantineData[0].value);
    }, []);

    const handleChange = (_value: string | null) => {
        if (_value === null) {
            onChange(null);
            return;
        }
        let setData : any = undefined
        // @ts-ignore
        if(data[_value]?.data){
            // @ts-ignore
            setData = data[_value].data
        }
        const parsedNumber = Number(_value);
        if (!isNaN(parsedNumber) && data.some((item) => item.value === parsedNumber)) {
            onChange(parsedNumber,setData);
        } else {
            onChange(_value,setData);
        }
    };
    try {
        return (
            <Select
                {...rest}
        data={mantineData}
        value={stringValue}
        onChange={handleChange}
        allowDeselect={false}
        />
    );
    }
    catch (error) {
        console.error('CustomSelect rendering error:', error);
        // @ts-ignore
        return <Select {...rest} disabled error={error}/>;
    }
};

export default CustomSelect;

function hasDuplicateValues(arr: any[]): boolean {
    const seen = new Set<string | number | null>();
    for (const item of arr) {
        if (seen.has(item.value)) {
            return true;
        }
        seen.add(item.value);
    }
    return false;
}

