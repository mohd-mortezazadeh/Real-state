import {privateAxios} from "../axiosInstances/privateAxios";


export const putRating = async (value: number | null, id: number, options = {}) => {
    const response = await privateAxios().put(`/ratinguser/${id}/`, {rating: value}, options)
    return response.data
}

export const getRating = async (id: number, options = {}) => {
    const response = await privateAxios().get(`/ratinguser/${id}/`, options)
    return response.data
}

export const putRatingArticle = async (value: number | null, id: number, options = {}) => {
    const response = await privateAxios().put(`/articlerating/${id}/`, {rating: value}, options)
    return response.data
}

export const getRatingArticle = async (id: number, options = {}) => {
    const response = await privateAxios().get(`/articlerating/${id}/`, options)
    return response.data
}
