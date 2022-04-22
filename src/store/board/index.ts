import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';
import * as reducers from './reducers';

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers,
    extraReducers: (builder) => {
        builder;
    },
});

export const { addPlayerFieldState, addCpuFieldState } = boardSlice.actions;

export default boardSlice.reducer;
