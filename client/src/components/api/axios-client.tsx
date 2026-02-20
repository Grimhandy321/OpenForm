import axios from "axios";
import {showNotification} from "@mantine/notifications";
import {useTranslator} from "../openForm/hooks/translator.ts";
import {IconCheck} from "@tabler/icons-react";

export const baseUrl = (): string => {
    let url = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_BASE_PATH}/api`;
    if (typeof window !== 'undefined' && import.meta.env.VITE_ENV !== "DEV") {
        url = `${location.protocol}//${location.host}${import.meta.env.VITE_API_BASE_PATH}/api`;
    }
    return url;
}


//hookless call
export const useAxiosClient = () => {
    const axiosClient = axios.create({
        withCredentials: true,
        baseURL: baseUrl(),
    });
    const {tr} = useTranslator();
    axiosClient.interceptors.response.use(
        response => {
            if (response.data && typeof response.data.navigate === "string") {
                window.location.replace(response.data.navigate);
            }

            if (response.data.status === "error" && response?.data?.msg) {
                // @ts-ignore
                showNotification({
                    title: tr(response.data.msg),
                    icon: <IconCheck/>,
                    color: 'red',
                    autoClose: 5000,
                });
            }
            if (response?.data?.messages) {
                response?.data?.messages.map((item : any) => {
                    // @ts-ignore
                    showNotification({
                        title: tr(item.message),
                        icon: <IconCheck/>,
                        color: item.type === "error" ? "red": item.type === "green" ? "green": "blue",
                        autoClose: 5000,
                    });
                })
            }
            return response;
        },
    );
    return axiosClient;
}
export interface AbstactQueryResult{
    status: "success" | "error" | string | undefined,
    msg: string | null;
    messages?: any[];
}
