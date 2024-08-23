import {privateAxios} from "../axiosInstances/privateAxios";
import {publicAxios} from "../axiosInstances/publicAxios";

export const createArticle = async (value: any, option = {}) => {
    const response = await privateAxios().post('/article/', value, option)
    return response.data
}

export const editArticle = async (value: any, id : number , option = {}) => {
    const response = await privateAxios().put(`/article/${id}`, value, option)
    return response.data
}


export const getArticlesPage = async (page = 1, queries: any, limit = 4, options = {}) => {
    const response = await publicAxios().get(`/article?_page=${page}&_limit=${limit}&${queries}`, options)
    return response.data
}

export const deleteArticle = async (id: number, options = {}) => {
    const response = await publicAxios().get(`/article/${id}/ `, options)
    return response.data
}