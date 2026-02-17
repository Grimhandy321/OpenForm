import moment from "moment";

export const formatToUTCDate = (value: Date | null): Date | null => {
    if (value) {
        return moment.utc(pad(value.getFullYear()) + '-' + pad(value.getMonth() + 1) + '-' + pad(value.getDate())).toDate();
    }
    return null;
}


const pad = (n: number): number | string => {
    return n < 10 ? '0' + n : n
}
