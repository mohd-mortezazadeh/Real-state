import {privateAxios} from "../axiosInstances/privateAxios";

export const createProfile = async (value: any, option = {}) => {
    const response = await privateAxios().post('/profile/', value, option)
    return response.data
}

export const getProfile = async (option = {}) => {
    const response = await privateAxios().get('/profile/', option)
    return response.data
}