import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import {RootState} from "../store";
import toast from "react-hot-toast";

interface commentStateProps {
    comments: any[],
    page: number,
    hasNextPage: boolean,
    getLoading: boolean,
    createLoading: boolean,
    createReplyLoading: boolean,
    error: string,
    deleteLoading: boolean
}

const initialState: commentStateProps = {
    comments: [],
    page: 1,
    hasNextPage: false,
    getLoading: false,
    createLoading: false,
    createReplyLoading: false,
    deleteLoading: false,
    error: '',
}


export const get_comments: any = createAsyncThunk('comment/get_comments', async ({page , id}: any) => {
    try {
        const res: AxiosResponse = await publicAxios().get(`/comment/${id}/?_page=${page}&_limit=5`)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const create_comment: any = createAsyncThunk('comment/create_comment', async ({value}: any) => {
    try {
        const res: AxiosResponse = await publicAxios().post(`/comment/`, value)
        return res.data
    } catch (err) {
        return Promise.reject(err)
    }
})

export const delete_comment: any = createAsyncThunk('comment/delete_comment', async (id: any) => {
    try {
        const res: AxiosResponse = await publicAxios().delete(`/comment/${id}/`)
        return {
            data: res.data,
            id: id
        }
    } catch (err) {
        return Promise.reject(err)
    }
})

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        reset: () => initialState,
        addComment: (state, action) => {

        }
    },
    extraReducers: builder => {
        builder
            .addCase(get_comments.pending, (state, action) => {
                state.getLoading = true
            })
            .addCase(get_comments.fulfilled, (state, action) => {
                state.comments.push(...action.payload.results)
                state.hasNextPage = !!action.payload.next
                state.getLoading = false
            })
            .addCase(get_comments.rejected, (state, action) => {
                state.getLoading = false
            })
            .addCase(create_comment.pending, (state, action) => {
                state.createLoading = true
            })
            .addCase(create_comment.fulfilled, (state, action) => {
                state.comments.unshift(action.payload)
                toast.success("نظر شما با موفقیت ثبت شد")
                state.createLoading = false
            })
            .addCase(create_comment.rejected, (state, action) => {
                state.createLoading = false
            })
            .addCase(delete_comment.pending, (state, action) => {
                state.deleteLoading = true
            })
            .addCase(delete_comment.fulfilled, (state, action) => {
                const deletedItem = state.comments.findIndex(cm => cm.id === action.payload.id)
                state.comments.splice(deletedItem, 1)

                toast.success("نظر شما با موفقیت حذف شد")
                state.deleteLoading = false
            })
            .addCase(delete_comment.rejected, (state, action) => {
                state.deleteLoading = false
            })
    }
})

export const comments = (state: RootState) => state.comments

export const {reset, addComment} = commentSlice.actions

export default commentSlice.reducer;