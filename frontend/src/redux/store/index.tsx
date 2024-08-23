import {configureStore} from '@reduxjs/toolkit'
import formState from "../slices/formSlice";
import authState from "../slices/authSlice";
import userState from "../slices/userSlice";
import addPropertyState from "../slices/addPropertySlice";
import ticketState from "../slices/ticketSlice";
import blogsState from "../slices/blogSlice";
import propertiesSlice from "../slices/propertiesSlice";
import commentSlice from "../slices/commentSlice";

export const store = configureStore({
    reducer: {
        form: formState,
        auth : authState,
        user : userState,
        add_property : addPropertyState,
        tickets : ticketState,
        blogs : blogsState,
        properties : propertiesSlice,
        comments : commentSlice
    },
    devTools: true,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch