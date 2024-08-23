import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from '@reduxjs/toolkit';
import {RootState} from "../store";
import toast from "react-hot-toast";

interface FormState {
    page: (number | null)[],
    phone: string
}

const initialState: FormState = {
    page: [null, 1],
    phone: ''
}

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        handlePage: (state, action: PayloadAction<number | null>) => {
            state.page[0] = state.page[1]
            state.page[1] = action.payload
            if (action.payload === 4 || action.payload === 5) {
                toast.success('کد تایید برای شما ارسال شد')
            }
            // state.phone = action.payload
        },


    }
})

export const {handlePage} = formSlice.actions

export const selectFormPage = (state: RootState) => state.form.page[1]
export const selectFormPrevPage = (state: RootState) => state.form.page[0]
export const selectFormPhone = (state: RootState) => state.form.phone


export default formSlice.reducer
