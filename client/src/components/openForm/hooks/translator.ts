
export interface ILanguage {
    label: string,
    locale: string,
    countryCode: string,
    msatCookieCode: string,
}

export interface KeyValueData {
    value: string;
    label: string;
}

export interface Translation {
    key: string,
    translation: string,
}

export const fallbackLanguage = 'en-GB';

export const mapTranslations = (data: Translation[]): {} => {
    let translatedData: any = {};
    data.forEach((item: Translation): void => {
        if (item.key && item.translation) {
            translatedData[item.key] = item.translation;
        }
    });
    return translatedData;
}

export const translateKeyValue = (data: KeyValueData[], t: any): KeyValueData[] => {
    let tmp: KeyValueData[] = [];
    data.forEach((item: KeyValueData): void => {
        tmp.push({value: item.value, label: t(item.label)});
    })
    return tmp;
}

export const useTranslator = () => {
    function tr(key: string, hideKey?: boolean | null): string {
        if ( hideKey) {
            return "";
        } else {
            return key;
        }
    }

    return {tr};
}
