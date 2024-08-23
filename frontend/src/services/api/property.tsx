import {publicAxios} from "../axiosInstances/publicAxios";
import {privateAxios} from "../axiosInstances/privateAxios";
import {options} from "tsconfig-paths/lib/options";

export const getPropertyPage = async (page = 1, queries: any, limit = 4, options = {}) => {
    const response = await publicAxios().get(`/post/?_page=${page}&_limit=${limit}&${queries}`, options)
    return response.data
}


export const getAllProperty = async () => {
    const response = await publicAxios().get(`/posts`)
    return response.data
}




export const getProperty = async (id: string, options = {}) => {
    const response = await publicAxios().get(`/post/${id}`, options)
    return response.data
}

export const getVipProperties = async () =>{
    const response = await publicAxios().get('/ad-vip')

    return response
}

export const getCategories = async (options = {}) => {
    const response = await publicAxios().get(`/category`, options)
    return response.data
}

export const getCategoriesByCity = async (value: (string | null) = '', options = {}) => {
    const response = await publicAxios().get(`/category?city=${value}`, options)
    return response.data
}

export const getCities = async (options = {}) => {
    const response = await publicAxios().get(`/city`, options)
    return response.data
}

export const getCitiesByCategory = async (value: (number | string | null) = '', options = {}) => {
    const response = await publicAxios().get(`/city?category=${value}`, options)
    return response.data
}

export const getSections = async (city: number, options = {}) => {
    const response = await publicAxios().get(`/section?city=${city}`, options)
    return response.data
}

export const getOptions = async (options = {}) => {
    const response = await publicAxios().get(`/options`, options)
    return response.data
}


export const getOptionss = async (category: number, options = {}) => {
    const response = await publicAxios().get(`/options?category=${category}`, options)
    return response.data
}

export const getCompoanies = async (status = 1, options = {}) => {
    const response = await publicAxios().get(`/company?status=${status}`, options)
    return response.data
}


export const postThumbnail = async (value: FormData, options = {}) => {
    const response = await privateAxios().post('/media/', value, options)
    return response.data.id
}


export const addProperty = async (value: any, option = {}) => {
    const response = await privateAxios().post('/addpost/', value, option)
    return response.data
}

export const editPropertyPreview = async (value: any, id: number | string | null, option = {}) => {

    const response = await privateAxios().put(`/addpost/${id}`, value, option)
    return response.data
}

export const getGallery = async (id: number, option = {}) => {
    const response = await privateAxios().get(`/media/${id}`, option)
    return response.data
}


export const getMyProperties = async (page = 1, queries: any, limit = 4, options = {}) => {
    const response = await privateAxios().get(`/my-ad/?_page=${page}&_limit=${limit}&${queries}`, options)
    return response.data
}

export const deleteMyProperties = async (id: number, options = {}) => {
    const response = await privateAxios().delete(`/my-ad/${id}/`, options)
    return response.data
}


export const getMyFavourites = async (page = 1, queries: any, limit = 4, options = {}) => {
    const response = await privateAxios().get(`/bookmark/?_page=${page}&_limit=${limit}&${queries}`, options)
    return response.data
}

export const putBookmark = async (id: number) => {
    const response = await privateAxios().put(`/bookmark/${id}/`)
    return response.data
}