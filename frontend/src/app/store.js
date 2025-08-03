import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/userslice'
export const  store = configureStore({
    reducer:userReducer
})