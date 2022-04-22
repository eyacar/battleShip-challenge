import { PayloadAction } from '@reduxjs/toolkit';
import { BOARD, FieldState } from './interfaces';

interface AddPayload {
    fieldName: string;
    fieldState: FieldState;
}

export const addPlayerFieldState = (state: BOARD, action: PayloadAction<AddPayload>) => {
    const { fieldName, fieldState } = action.payload;
    const { playerFields } = state;
    state.playerFields = { ...playerFields, [fieldName]: fieldState };
};

export const addCpuFieldState = (state: BOARD, action: PayloadAction<AddPayload>) => {
    const { fieldName, fieldState } = action.payload;
    const { cpuFields } = state;
    state.cpuFields = { ...cpuFields, [fieldName]: fieldState };
};
