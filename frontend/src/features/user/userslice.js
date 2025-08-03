import { createSlice,nanoid } from "@reduxjs/toolkit";
import User from "../../models/User";
const initialState = {
    user:new User(nanoid(),"","","")
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user.name = action.payload.name;
            state.user.email = action.payload.email;
            state.user.password = action.payload.password;
        },
        clearUser: (state,action) => {
            state.user = null;
        }
    }
});

export const { addUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
