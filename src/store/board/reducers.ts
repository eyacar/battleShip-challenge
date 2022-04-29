/* eslint-disable no-magic-numbers */
import { PayloadAction } from '@reduxjs/toolkit';
import { BOARD, FieldState } from './interfaces';
import { CpuShips } from '../../helper/CpuBoardHelper';
import initialState from './initialState';

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

    state.cpuMatchBoard.cpuFields = { ...carrier, ...cruisers1, ...cruisers2, ...cruisers3, ...submarine };
    state.cpuShips = {
        carrier1: Object.keys(carrier),
        cruisers1: Object.keys(cruisers1),
        cruisers2: Object.keys(cruisers2),
        cruisers3: Object.keys(cruisers3),
        submarine1: Object.keys(submarine),
    };
};

export const addPlayerMove = (state: BOARD, action: PayloadAction<string>) => {
    const cpuFieldState: FieldState = state.cpuMatchBoard.cpuFields[action.payload]
        ? state.cpuMatchBoard.cpuFields[action.payload]
        : { situation: 'MISSED', ship: '' };

    state.playerMoves = [...state.playerMoves, action.payload];
    if (cpuFieldState.situation === 'MISSED') {
        state.cpuFields = { ...state.cpuFields, [action.payload]: cpuFieldState };
    } else if (cpuFieldState.situation === 'SHIP') {
        // First take of the field from the ship array
        const leftShipFields = state.cpuShips[cpuFieldState.ship].filter((field) => field !== action.payload);

        // eslint-disable-next-line no-magic-numbers
        if (leftShipFields.length === 0) {
            // if the ships array is empty, the field is the last one of the ship
            const cpuFields = Object.keys(state.cpuMatchBoard.cpuFields);
            // Because is the last field from the ship, When i get all the used cpu fields from state i change all the fields to destroyed
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const destroyedFields: Record<string, FieldState> = cpuFields
                .filter((field) => state.cpuMatchBoard.cpuFields[field].ship === cpuFieldState.ship)
                .reduce((acc, field) => ({ ...acc, [field]: { situation: 'DESTROYED', ship: cpuFieldState.ship } }), {});

            state.cpuFields = { ...state.cpuFields, ...destroyedFields };
            state.cpuShips = { ...state.cpuShips, [cpuFieldState.ship]: [] };
        } else {
            state.cpuFields = { ...state.cpuFields, [action.payload]: { ...cpuFieldState, situation: 'HIT' } };
            state.cpuShips = { ...state.cpuShips, [cpuFieldState.ship]: leftShipFields };
        }
    }
};

export const addCpuBoard = (state: BOARD, action: PayloadAction<{ columns: string[]; rows: number }>) => {
    const { columns, rows } = action.payload;
    state.cpuMatchBoard.playerLeftFieldsBoard = columns.reduce(
        (acc: string[], column: string) => [
            ...acc,
            ...Array(rows)
                .fill(' ')
                // eslint-disable-next-line no-magic-numbers
                .map((_, i) => `${column}${i}`),
        ],
        [],
    );
};

export const addCpuMove = (state: BOARD, action: PayloadAction<{ columns: string[]; rows: number }>) => {
    const { cpuMoves, cpuMatchBoard, playerFields, playerShips } = state;
    const { playerLeftFieldsBoard } = cpuMatchBoard;

    const randomField = Math.floor(Math.random() * playerLeftFieldsBoard.length);

    const lastMove: string = cpuMoves[cpuMoves.length - 1];

    const situation = (field: FieldState): 'MISSED' | 'HIT' => (field ? 'HIT' : 'MISSED');
    const ship = (field: FieldState): string => (field ? field.ship : '');

    if (!lastMove || playerFields[lastMove]?.situation === 'DESTROYED') {
        // On the first move and when the last move is destroyed the cpu will shoot randomly
        let field = playerLeftFieldsBoard[randomField];

        const forgottenHitOnTheBoard = Object.keys(playerFields).filter((element) => playerFields[element].situation === 'HIT');
        if (playerFields[lastMove]?.situation === 'DESTROYED' && forgottenHitOnTheBoard.length > 0) {
            // If Cpu destroyed a ship and there is a forgotten hit on the board because are two ships together cpu down of that ship
            const { columns, rows } = action.payload;
            const columnIndex = columns.indexOf(forgottenHitOnTheBoard[0][0]);

            const lastHitUpField = columns[columnIndex - 1] ? `${columns[columnIndex - 1]}${forgottenHitOnTheBoard[0][1]}` : '';
            const lastHitDownField = columns[columnIndex + 1] ? `${columns[columnIndex + 1]}${forgottenHitOnTheBoard[0][1]}` : '';
            const lastHitLeftField =
                Number(forgottenHitOnTheBoard[0][1]) - 1 >= 0
                    ? forgottenHitOnTheBoard[0][0] + (Number(forgottenHitOnTheBoard[0][1]) - 1)
                    : '';
            const lastHitRightField =
                Number(forgottenHitOnTheBoard[0][1]) + 1 < rows
                    ? forgottenHitOnTheBoard[0][0] + (Number(forgottenHitOnTheBoard[0][1]) + 1)
                    : '';
            const up = cpuMoves.includes(lastHitUpField) ? '' : lastHitUpField;
            const down = cpuMoves.includes(lastHitDownField) ? '' : lastHitDownField;
            const left = cpuMoves.includes(lastHitLeftField) ? '' : lastHitLeftField;
            const right = cpuMoves.includes(lastHitRightField) ? '' : lastHitRightField;

            field = up || down || left || right;
        }

        state.playerFields = {
            ...state.playerFields,
            [field]: { situation: situation(playerFields[field]), ship: ship(playerFields[field]) },
        };

        const filterBoard = playerLeftFieldsBoard.filter((element) => element !== field);
        state.cpuMatchBoard.playerLeftFieldsBoard = filterBoard;
        state.cpuMoves = [...cpuMoves, field];

        if (situation(playerFields[field]) === 'HIT' && ship(playerFields[field])) {
            // if random hit is a ship field i take of from the ship array
            const leftShipFields = playerShips[ship(playerFields[field])].filter((shipField) => shipField !== field);
            state.playerShips = { ...playerShips, [ship(playerFields[field])]: leftShipFields };
        }
    } else {
        const { columns, rows } = action.payload;
        const columnIndex = columns.indexOf(lastMove[0]);

        const lastMoveUpField = columns[columnIndex - 1] ? `${columns[columnIndex - 1]}${lastMove[1]}` : '';
        const lastMoveDownField = columns[columnIndex + 1] ? `${columns[columnIndex + 1]}${lastMove[1]}` : '';
        const lastMoveLeftField = Number(lastMove[1]) - 1 >= 0 ? lastMove[0] + (Number(lastMove[1]) - 1) : '';
        const lastMoveRightField = Number(lastMove[1]) + 1 < rows ? lastMove[0] + (Number(lastMove[1]) + 1) : '';

        // The CPU strategy is if the last move is hit check witch of the around fields is hit and continues the ship. If there is not field to shoot goes in the clock direction of the last move. But if is water around the last move, the cpu will shoot randomly.

        let nextMove = playerLeftFieldsBoard[randomField]; // start as a random move and change depending of previous moves

        if (playerFields[lastMove].situation === 'HIT') {
            if (
                (!cpuMoves.includes(lastMoveDownField) &&
                    !cpuMoves.includes(lastMoveUpField) &&
                    !cpuMoves.includes(lastMoveLeftField) &&
                    !cpuMoves.includes(lastMoveRightField)) ||
                (playerFields[lastMoveDownField]?.situation !== 'HIT' &&
                    playerFields[lastMoveUpField]?.situation !== 'HIT' &&
                    playerFields[lastMoveLeftField]?.situation !== 'HIT' &&
                    playerFields[lastMoveRightField]?.situation !== 'HIT')
            ) {
                // If the random moves goes hit the first choice is going down if it's not available then left like clockwise. Then if there is a hit and a previous move it need to continues the ship.
                const moveUp = lastMoveUpField && !cpuMoves.includes(lastMoveUpField) ? lastMoveUpField : '';
                const moveDown = lastMoveDownField && !cpuMoves.includes(lastMoveDownField) ? lastMoveDownField : '';
                const moveLeft = lastMoveLeftField && !cpuMoves.includes(lastMoveLeftField) ? lastMoveLeftField : '';
                const moveRight = lastMoveRightField && !cpuMoves.includes(lastMoveRightField) ? lastMoveRightField : '';

                nextMove = moveDown || moveLeft || moveUp || moveRight;
            } else if (lastMoveUpField && playerFields[lastMoveUpField]?.situation === 'HIT') {
                nextMove = lastMoveDownField;
            } else if (lastMoveRightField && playerFields[lastMoveRightField]?.situation === 'HIT') {
                nextMove = lastMoveLeftField;
            } else if (lastMoveDownField && playerFields[lastMoveDownField]?.situation === 'HIT') {
                nextMove = lastMoveUpField;
            } else if (lastMoveLeftField && playerFields[lastMoveLeftField]?.situation === 'HIT') {
                nextMove = lastMoveRightField;
            }
        } else if (playerFields[lastMove].situation === 'MISSED' || !playerFields[lastMove]) {
            // Here the last move is missed instead of hit.
            if (
                (!cpuMoves.includes(lastMoveDownField) &&
                    !cpuMoves.includes(lastMoveLeftField) &&
                    !cpuMoves.includes(lastMoveRightField) &&
                    !cpuMoves.includes(lastMoveUpField)) ||
                (playerFields[lastMoveLeftField]?.situation !== 'HIT' &&
                    playerFields[lastMoveRightField]?.situation !== 'HIT' &&
                    playerFields[lastMoveDownField]?.situation !== 'HIT' &&
                    playerFields[lastMoveUpField]?.situation !== 'HIT')
            ) {
                // if the last move is water and there is no field around the last move or there is water or destroyed around the cpu will shoot randomly
                nextMove = playerLeftFieldsBoard[randomField];
            } else if (lastMoveUpField && playerFields[lastMoveUpField]?.situation === 'HIT') {
                // if the up field is hit there are tow choice the up of your the hit is hit, in this case we need to complete the ship, or there is nothing up and we continues to left like a clock.
                const upPreviousHit = columns[columnIndex - 2] ? `${columns[columnIndex - 2]}${lastMove[1]}` : '';
                const leftPreviousHit =
                    columns[columnIndex - 1] && Number(lastMove[1]) - 1 >= 0 ? `${columns[columnIndex - 1]}${Number(lastMove[1]) - 1}` : '';
                const rightPreviousHit =
                    columns[columnIndex - 1] && Number(lastMove[1]) + 1 < rows
                        ? `${columns[columnIndex - 1]}${Number(lastMove[1]) + 1}`
                        : '';

                if (upPreviousHit && playerFields[upPreviousHit]?.situation === 'HIT') {
                    nextMove = playerShips[playerFields[lastMoveUpField].ship][0];
                } else {
                    nextMove = leftPreviousHit || upPreviousHit || rightPreviousHit;
                }
            } else if (lastMoveRightField && playerFields[lastMoveRightField]?.situation === 'HIT') {
                const rightPreviousHit = Number(lastMove[1]) + 2 < rows ? `${lastMove[0]}${Number(lastMove[1]) + 2}` : '';
                const upPreviousHit =
                    columns[columnIndex - 1] && Number(lastMove[1]) + 1 < rows
                        ? `${columns[columnIndex - 1]}${Number(lastMove[1]) + 1}`
                        : '';

                if (rightPreviousHit && playerFields[rightPreviousHit]?.situation === 'HIT') {
                    nextMove = playerShips[playerFields[rightPreviousHit].ship][0];
                } else {
                    nextMove = upPreviousHit || rightPreviousHit;
                }
            } else if (lastMoveDownField && playerFields[lastMoveDownField]?.situation === 'HIT') {
                const downPreviousHit = columns[columnIndex + 2] ? `${columns[columnIndex + 2]}${lastMove[1]}` : '';
                const rightPreviousHit =
                    columns[columnIndex + 1] && Number(lastMove[1]) + 1 < rows
                        ? `${columns[columnIndex + 1]}${Number(lastMove[1]) + 1}`
                        : '';

                if (downPreviousHit && playerFields[downPreviousHit]?.situation === 'HIT') {
                    nextMove = playerShips[playerFields[downPreviousHit].ship][0];
                } else {
                    nextMove = rightPreviousHit;
                }
            } else if (playerFields[lastMoveRightField]?.situation === 'HIT') {
                // When you get to this point for the clock strategy if the right of the missed move is hit the only choice is you need to complete the ship
                nextMove = playerShips[playerFields[lastMoveRightField].ship][0];
            }
        }

        const filterBoard = playerLeftFieldsBoard.filter((element) => element !== nextMove);
        state.cpuMatchBoard.playerLeftFieldsBoard = filterBoard;
        state.cpuMoves = [...cpuMoves, nextMove];

        const leftShipFields =
            ship(playerFields[nextMove]) && playerShips[ship(playerFields[nextMove])].filter((shipField) => shipField !== nextMove);

        if (leftShipFields && leftShipFields.length === 0) {
            const playerFieldsList = Object.keys(playerFields);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const destroyedFields: Record<string, FieldState> = playerFieldsList
                .filter((field) => playerFields[field].ship === playerFields[nextMove].ship)
                .reduce((acc, field) => ({ ...acc, [field]: { situation: 'DESTROYED', ship: playerFields[nextMove].ship } }), {});
            state.playerFields = { ...state.playerFields, ...destroyedFields };
            state.playerShips = { ...state.playerShips, [ship(playerFields[nextMove])]: [] };
        } else if (leftShipFields && leftShipFields.length > 0) {
            state.playerFields = { ...state.playerFields, [nextMove]: { ...playerFields[nextMove], situation: 'HIT' } };
            state.playerShips = { ...playerShips, [ship(playerFields[nextMove])]: leftShipFields };
        } else {
            state.playerFields = { ...state.playerFields, [nextMove]: { ...playerFields[nextMove], situation: 'MISSED' } };
        }
    }
};

export const clearState = (state: BOARD) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state.cpuFields = initialState.cpuFields;
    state.cpuMatchBoard = initialState.cpuMatchBoard;
    state.cpuMoves = initialState.cpuMoves;
    state.cpuShips = initialState.cpuShips;
    state.playerFields = initialState.playerFields;
    state.playerMoves = initialState.playerMoves;
    state.playerShips = initialState.playerShips;
};
