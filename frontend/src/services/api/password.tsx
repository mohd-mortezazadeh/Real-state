import {privateAxios} from "../axiosInstances/privateAxios";

export const handlePassword = async ( value : any,option = {}) => {
    const response = await privateAxios().post('/password/',value ,option)
    return response.data
}