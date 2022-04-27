import { PayloadAction } from '@reduxjs/toolkit';
import { BOARD, FieldState } from './interfaces';
import { CpuShips } from '../../helper/CpuBoardHelper';

type Fields = Record<string, FieldState>;

export const addPlayerShipFields = (state: BOARD, action: PayloadAction<Fields>) => {
    const { playerFields } = state;
    state.playerFields = { ...playerFields, ...action.payload };
};

export const addPlayerHoverState = (state: BOARD, action: PayloadAction<{ selected: Fields; WantToSelect: Fields }>) => {
    const { selected, WantToSelect } = action.payload;
    state.playerFields = { ...selected, ...WantToSelect };
};

export const addPlayerShips = (state: BOARD, action: PayloadAction<Record<string, string[]>>) => {
    const { playerShips } = state;
    state.playerShips = { ...playerShips, ...action.payload };
};

export const addCpuShips = (state: BOARD, action: PayloadAction<CpuShips>) => {
    const { carrier, cruisers1, cruisers2, cruisers3, submarine } = action.payload;

    state.cpuFields = { ...carrier, ...cruisers1, ...cruisers2, ...cruisers3, ...submarine };
    state.cpuShips = {
        carrier1: Object.keys(carrier),
        cruisers1: Object.keys(cruisers1),
        cruisers2: Object.keys(cruisers2),
        cruisers3: Object.keys(cruisers3),
        submarine1: Object.keys(submarine),
    };
};
