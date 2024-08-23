import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import {AxiosResponse} from "axios";

import toast from "react-hot-toast";
import {privateAxios} from "../../services/axiosInstances/privateAxios";
import Router from "next/router";

interface authState {
    user_types: {
        is_loggin: boolean | null,
        is_admin: boolean | null,
        has_password: boolean | null,
        detail: string,
        status: number | null
    },

    user_info: {
        phone: string,
        role: number | null,
        fullname: string,
        city: number | null,
        company_name: string | number
    },
    code: null | number
    token: string,
    loading: boolean,
    error: string,
    forget_pass: boolean
}

const initialState: authState = {
    user_types: {
        is_loggin: null,
        is_admin: null,
        has_password: null,
        detail: '',
        status: null
    },
    user_info: {
        phone: '',
        role: null,
        fullname: '',
        city: null,
        company_name: ''

    },
    code: null,
    token: '',
    loading: false,
    error: '',
    forget_pass: false
}


export const auth_phone: any = createAsyncThunk('auth/auth_phone', async (phone) => {
    try {
        const res: AxiosResponse = await publicAxios().post('/auth', phone)
        return {
            phone,
            data: res.data
        }
    } catch (err) {
        return Promise.reject(err)
    }
})

export const auth_info: any = createAsyncThunk('auth/auth_info', async (params) => {
    try {
        const res: AxiosResponse = await publicAxios().post('/info', params)
        return {
            user: params,
            data: res.data
        }
    } catch (err) {
        return Promise.reject(err)
    }
})


export const auth_verify: any = createAsyncThunk('auth/auth_verify', async (params, thunkAPI) => {
    try {
        const res: AxiosResponse = await publicAxios().post('/verify', params)
        if (res.data.status === 200) {
            const toastId = toast.loading("در حال ارسال به صفحه اصلی")
            Router.push('/').then(() => {
                toast.dismiss(toastId)
                thunkAPI.dispatch(reset())
            })
        }
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const auth_password: any = createAsyncThunk('auth/auth_password', async (params, thunkAPI) => {
    try {
        const res: AxiosResponse = await publicAxios().post('/password', params)
        if (res.data.status === 200) {

            const toastId = toast.loading("در حال ارسال به صفحه اصلی")

            Router.push('/').then(() => {
                toast.dismiss(toastId)
                thunkAPI.dispatch(reset())
            })

        }
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const auth_forget_password: any = createAsyncThunk('auth/auth_forget_password', async (phone) => {
    try {
        const res: AxiosResponse = await publicAxios().post('/forgot-pass', phone)

        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const auth_logout: any = createAsyncThunk('auth/auth_logout', async (params, thunkAPI) => {
    try {
        const res: AxiosResponse = await privateAxios().post('/logout')


        if (res.data.status === 200) {

            Router.push('/')
            thunkAPI.dispatch(reset())
        }


    } catch (err) {
        return Promise.reject(err)
    }
})


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers(builder) {
        builder
            .addCase(auth_phone.pending, (state, action) => {

                state.loading = true
            })
            .addCase(auth_phone.fulfilled, (state, action) => {
                state.user_info.phone = action.payload.phone.phone
                state.user_types = action.payload.data
                state.loading = false
                if (action.payload.data.is_loggin) {
                    state.token = action.payload.data.token
                }

            })
            .addCase(auth_phone.rejected, (state, action) => {
                state.loading = false
                // state.error = action.payload
            })
            .addCase(auth_info.pending, (state, action) => {
                state.loading = true

            })
            .addCase(auth_info.fulfilled, (state, action) => {
                state.loading = false

                if (action.payload.data.status === 200) {
                    state.token = action.payload.data.token
                    state.user_types.is_loggin = action.payload.data.is_loggin
                    state.user_info = action.payload.user
                }
            })
            .addCase(auth_info.rejected, (state, action) => {
                state.loading = false
                // state.error = action.payload
            })
            .addCase(auth_verify.pending, (state, action) => {
                state.loading = true

            })
            .addCase(auth_verify.fulfilled, (state, action) => {
                state.loading = false
                // state.code = action.payload.code
                // state.user_info = initialState.user_info
                // state.user_types = initialState.user_types
                // state.token = initialState.token
                // state.forget_pass = initialState.forget_pass
                // state.code = initialState.code
                // state.error = initialState.error

            })
            .addCase(auth_verify.rejected, (state, action) => {
                state.loading = false
                // state.error = action.payload.detail
            })
            .addCase(auth_password.pending, (state, action) => {
                state.loading = true

            })
            .addCase(auth_password.fulfilled, (state, action) => {
                state.loading = false
                // state.user_info = initialState.user_info
                // state.user_types = initialState.user_types
                // state.token = initialState.token
                // state.forget_pass = initialState.forget_pass
                // state.code = initialState.code
                // state.error = initialState.error
            })
            .addCase(auth_password.rejected, (state, action) => {
                state.loading = false
                // state.error = action.payload.detail
            })
            .addCase(auth_forget_password.pending, (state, action) => {
                state.loading = true

            })
            .addCase(auth_forget_password.fulfilled, (state, action) => {
                state.loading = false
                state.code = action.payload.code
                if (action.payload.status === 200) {
                    state.token = action.payload.token
                    state.forget_pass = true
                }
            })
            .addCase(auth_forget_password.rejected, (state, action) => {
                state.loading = false
                // state.error = action.payload.detail
            })
            .addCase(auth_logout.pending, (state, action) => {
                state.loading = true

            })
            .addCase(auth_logout.fulfilled, (state, action) => {
                state.loading = false
                Router.reload()

            })
            .addCase(auth_logout.rejected, (state, action) => {
                state.loading = false
                // state.error = action.payload.detail
            })


    }
})

export const {reset} = authSlice.actions

export const userTypes = (state: RootState) => state.auth.user_types
export const userPhone = (state: RootState) => state.auth.user_info.phone
export const userToken = (state: RootState) => state.auth.token
export const userInfo = (state: RootState) => state.auth.user_info
export const forgetPass = (state: RootState) => state.auth.forget_pass
export const loading = (state: RootState) => state.auth.loading


export default authSlice.reducer
