import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";


interface User {
    user?: any
}

const initialState : User = {
    user: {}
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<User>) => {

            state.user = action.payload
        }
    }


})

export const {updateUser} = userSlice.actions


export const userState = (state: RootState) => state.user.user

export default userSlice.reducer