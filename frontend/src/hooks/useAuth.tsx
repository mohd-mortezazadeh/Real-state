import {useAppDispatch} from "./useRedux";
import useSWRImmutable from 'swr/immutable'

import {privateAxios} from "../services/axiosInstances/privateAxios";
import {updateUser} from "../redux/slices/userSlice";
import {useEffect} from "react";


const useAuth = () => {
    const dispatch = useAppDispatch()

    const {data, error} = useSWRImmutable("user_me", () => {
        return privateAxios().get('/user').catch(err => {
            throw err
        })
    } , {

    })


    useEffect(()=>{
        dispatch(updateUser( data?.data?.data))
    } , [data])

    return {
        user: data?.data?.data, error, loading: !data && !error
    }
}

export {useAuth}