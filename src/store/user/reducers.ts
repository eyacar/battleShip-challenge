import { PayloadAction } from '@reduxjs/toolkit';
import { USER } from './interfaces';

export const addUserName = (state: USER, action: PayloadAction<string>) => {
    state.userName = action.payload;
};
