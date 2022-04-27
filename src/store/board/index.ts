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

export const { addPlayerShips, addCpuShips, addPlayerShipFields, addPlayerHoverState } = boardSlice.actions;

export default boardSlice.reducer;
