import { BOARD } from './interfaces';

const initialState: BOARD = {
    playerFields: {},
    cpuFields: {},
    playerShips: {},
    cpuShips: {},
    cpuMatchBoard: {
        cpuFields: {},
        playerLeftFieldsBoard: [],
    },
    playerMoves: [],
    cpuMoves: [],
};

export default initialState;
