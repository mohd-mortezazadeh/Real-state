import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {AxiosResponse} from "axios";
import {privateAxios} from "../../services/axiosInstances/privateAxios";
import toast from "react-hot-toast";

interface ticketState {
    tickets: any,
    ticketBox: any[],
    getLoading: boolean,
    getLoadingBox: boolean,
    createLoading: boolean,
    createChatLoading: boolean
}

const initialState: ticketState = {
    tickets: [],
    ticketBox: [],
    getLoading: false,
    getLoadingBox: false,
    createLoading: false,
    createChatLoading: false
}


export const get_tickets: any = createAsyncThunk('auth/get_tickets', async ({query , page} : any) => {

    try {
        const res: AxiosResponse = await privateAxios().get(`/ticket/?_page=${page}&_limit=5&${query}`)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const get_tickets_user: any = createAsyncThunk('auth/get_tickets_user', async (query) => {
    
    try {
        const res: AxiosResponse = await privateAxios().get(`/ticket/?${query}`)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const get_ticket: any = createAsyncThunk('auth/get_ticket', async ({id}: any) => {
    try {
        const res: AxiosResponse = await privateAxios().get(`/ticket/${id}/`)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const create_ticket: any = createAsyncThunk('auth/create_ticket', async (values: any) => {
    try {

        const res: AxiosResponse = await privateAxios().post(`/ticket/`, values)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const create_chat_ticket: any = createAsyncThunk('auth/create_chat_ticket', async (values: any) => {
    try {

        const res: AxiosResponse = await privateAxios().post(`/ticket/`, values)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})


export const ticketSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(get_tickets.pending, (state, action) => {

                state.getLoading = true
            })
            .addCase(get_tickets.fulfilled, (state, action) => {
                state.tickets = action.payload
                state.getLoading = false

            })
            .addCase(get_tickets.rejected, (state, action) => {
                state.getLoading = false
                // state.error = action.payload
            })
            .addCase(get_tickets_user.pending, (state, action) => {

                state.getLoading = true
            })
            .addCase(get_tickets_user.fulfilled, (state, action) => {
                state.tickets = action.payload
                state.getLoading = false

            })
            .addCase(get_tickets_user.rejected, (state, action) => {
                state.getLoading = false
                // state.error = action.payload
            })
            .addCase(get_ticket.pending, (state, action) => {

                state.getLoadingBox = true
            })
            .addCase(get_ticket.fulfilled, (state, action) => {
                state.ticketBox = action.payload
                state.getLoadingBox = false

            })
            .addCase(get_ticket.rejected, (state, action) => {
                state.getLoading = false
                // state.error = action.payload
            })
            .addCase(create_ticket.pending, (state, action) => {

                state.createLoading = true
            })
            .addCase(create_ticket.fulfilled, (state, action) => {
                state.tickets.unshift(action.payload)
                toast.success("تیکت ارسال شد")
                state.createLoading = false
            })
            .addCase(create_ticket.rejected, (state, action) => {
                state.createLoading = false
                // state.error = action.payload
            })
            .addCase(create_chat_ticket.pending, (state, action) => {

                state.createChatLoading = true
            })
            .addCase(create_chat_ticket.fulfilled, (state, action) => {
                state.ticketBox.push(action.payload)
                toast.success("تیکت ارسال شد")
                state.createChatLoading = false
            })
            .addCase(create_chat_ticket.rejected, (state, action) => {
                state.createChatLoading = false
                // state.error = action.payload
            })
    }
})


export const tickets = (state: RootState) => state.tickets.tickets
export const ticketBox = (state: RootState) => state.tickets.ticketBox
export const sendChatLoading = (state: RootState) => state.tickets.createChatLoading
export const addTicketLoading = (state: RootState) => state.tickets.createLoading


export default ticketSlice.reducer
