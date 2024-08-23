import axios, {AxiosRequestConfig} from "axios";
import toast from "react-hot-toast";
import {BASE_URL} from "../../configs/commons";

export const publicAxios = () => {
    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        withCredentials : true,
        headers : {
            "Content-Type": "application/json",
        },
    })

    axiosInstance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            return config
        }
    )

    axiosInstance.interceptors.response.use(
        res => {
            return res
        },

        err => {
            const res = err?.response
            if (res) {
                if (res.status === 400) {

                    toast.error(res?.data?.detail, {
                        duration: 3000,
                        position: "top-left"
                    });
                }
            }
        }
    )

    return axiosInstance
}