import {DateInput} from "@mantine/dates"
import {IconCalendar} from "@tabler/icons-react";
import moment from "moment";

export default function FormatedDateInput({...props}) {

    return (
        <DateInput
            valueFormat={"DD/MM/YYYY"}
            dateParser={(value: string) => moment(value, 'DD.MM.YYYY').toDate()}
            minDate={props.min}
            maxDate={props.max}
            rightSection={<IconCalendar size={16}/>}
            {...props}
        />

    )
}
