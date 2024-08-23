import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store";


interface ticketState {
    media: any[]
}

const initialState: ticketState = {
    media: []
}


export const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        handleAddMedia: (state, action) => {
            state.media[0] = action.payload
        },
        handleRemoveMedia: (state) => {
            delete state.media[0]
        },
        handleAddPodcast: (state, action) => {
            state.media[1] = action.payload
        },
        handleRemovePodcast: (state) => {
            delete state.media[1]
        },
    },

})


export const get_media = (state: RootState) => state.blogs.media

export const {handleAddMedia, handleRemoveMedia, handleAddPodcast, handleRemovePodcast} = blogSlice.actions

export default blogSlice.reducer
