import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {RootState} from "../store";

import {publicAxios} from "../../services/axiosInstances/publicAxios";

interface propertiesState {
    results: any[],
    isLoading: boolean,
    error: string,
    hasNextPage : boolean
}

const initialState: propertiesState = {
    results: [],
    isLoading: false,
    error: '',
    hasNextPage : false
}

export const get_properties: any = createAsyncThunk('get_properties', async ({
                                                                                      page,
                                                                                      queries,
                                                                                      limit,
                                                                                      options
                                                                                  }: any) => {
    try {
        const res = await publicAxios().get(`/post?_page=${page}&_limit=${limit}&${queries}`, options)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})


export const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(get_properties.pending, (state, action) => {
                state.isLoading = true

            })
            .addCase(get_properties.fulfilled, (state, action) => {
                state.results.push(action.results)
                state.hasNextPage = !!action.next
                state.isLoading = false

            })
            .addCase(get_properties.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

    }
})

export const propertiesState = (state : RootState) => state.properties

export const {} = propertiesSlice.actions

export default propertiesSlice.reducer
