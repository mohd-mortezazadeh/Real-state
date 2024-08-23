import {privateAxios} from "../axiosInstances/privateAxios";

export const getPackages = async () => {
    const response = await privateAxios().get('/add-package?all_package=on')
    return response.data
}

export const getSinglePackages = async () => {
    const response = await privateAxios().get('/add-package?free_package=on')
    return response.data
}

export const getOrders = async (options : any) => {
    const response = await privateAxios().get('/order/' , options)
    return response.data
}

export const createOrder = async (data: any) => {
    const response = await privateAxios().post('/order/', data)
    return response.data
}

export const addNardeban = async (data: any) => {
    const response = await privateAxios().post('/add-package', data)
    return response.data
}