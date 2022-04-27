import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';
import * as reducers from './reducers';

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers,
    extraReducers: (builder) => {
        builder;
    },
});

export const { addUserName } = userSlice.actions;

export default userSlice.reducer;
