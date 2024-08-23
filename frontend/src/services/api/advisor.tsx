import {privateAxios} from "../axiosInstances/privateAxios";

export const getAdvisors = async (page = 1, queries: any, status = 1, limit = 4, options = {}) => {
    const response = await privateAxios().get(`/check-advisor?_page=${page}&_limit=${limit}&${queries}&status=${status}`, options)

    return response.data
}


export const checkAdvisor = async (id : number | null, value : any , options = {}) => {
    const response = await privateAxios().put(`/check-advisor/${id}/` , value , options)
    return response.data

}