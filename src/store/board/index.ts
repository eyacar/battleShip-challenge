import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {},
    extraReducers: {},
});

export default boardSlice.reducer;
