import {publicAxios} from "../axiosInstances/publicAxios";


export const getComments = async (page: number, options = {}) => {
    const response = await publicAxios().get(`/comment/?_page=${page}&_limit=${10}/`, options)
    return response.data
}