import {privateAxios} from "../axiosInstances/privateAxios";

export const getDashboard = async () => {
    const response = await privateAxios().get('/dashboard')
    return response.data
}