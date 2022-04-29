import boardReducer, {
    addPlayerShips,
    addCpuShips,
    addPlayerShipFields,
    addPlayerHoverState,
    addPlayerMove,
    addCpuBoard,
    addCpuMove,
    clearState,
} from './index';
import { BOARD, FieldState } from './interfaces';

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

describe('User reducer', () => {
    const prevState: Record<string, FieldState> = { A1: { situation: 'SHIP', ship: 'cruiser' } };

    it('should handle initial state', () => {
        expect(boardReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addPlayerHoverState', () => {
        expect(
            boardReducer(
                { ...initialState, playerFields: prevState },
                addPlayerHoverState({
                    selected: { A4: { situation: 'SHIP', ship: 'cruiser' } },
                    WantToSelect: { A1: { situation: 'HIT', ship: 'carrier' } },
                }),
            ).playerFields,
        ).toEqual({ A1: { situation: 'HIT', ship: 'carrier' }, A4: { situation: 'SHIP', ship: 'cruiser' } });
    });

    it('should handle addPlayerShipFields', () => {
        expect(
            boardReducer({ ...initialState, playerFields: prevState }, addPlayerShipFields({ A6: { situation: 'SHIP', ship: 'carrier' } }))
                .playerFields,
        ).toEqual({ A1: { situation: 'SHIP', ship: 'cruiser' }, A6: { situation: 'SHIP', ship: 'carrier' } });
    });

    it('should handle addPlayerShips', () => {
        expect(
            boardReducer({ ...initialState, playerShips: { carrier: ['d1', 'd2', 'd3'] } }, addPlayerShips({ ship: ['a1', 'b1', 'c1'] }))
                .playerShips,
        ).toEqual({ carrier: ['d1', 'd2', 'd3'], ship: ['a1', 'b1', 'c1'] });
    });

    it('should handle addCpuShips', () => {
        const ships = { carrier: prevState, cruisers1: prevState, cruisers2: prevState, cruisers3: prevState, submarine: prevState };
        expect(boardReducer(initialState, addCpuShips(ships)).cpuMatchBoard.cpuFields).toEqual({
            ...prevState,
        });

        expect(boardReducer(initialState, addCpuShips(ships)).cpuShips).toEqual({
            carrier1: ['A1'],
            cruisers1: ['A1'],
            cruisers2: ['A1'],
            cruisers3: ['A1'],
            submarine1: ['A1'],
        });
    });

    it('should handle addPlayerMove', () => {
        expect(
            boardReducer(
                {
                    ...initialState,
                    cpuShips: { carrier1: ['A1'] },
                    cpuMatchBoard: { ...initialState.cpuMatchBoard, cpuFields: { A1: { situation: 'SHIP', ship: 'carrier1' } } },
                },
                addPlayerMove('A1'),
            ).cpuFields,
        ).toEqual({
            A1: { situation: 'DESTROYED', ship: 'carrier1' },
        });

        expect(
            boardReducer(
                {
                    ...initialState,
                    cpuShips: { carrier1: ['A1', 'A2'] },
                    cpuMatchBoard: { ...initialState.cpuMatchBoard, cpuFields: { A1: { situation: 'SHIP', ship: 'carrier1' } } },
                },
                addPlayerMove('A1'),
            ).cpuFields,
        ).toEqual({
            A1: { situation: 'HIT', ship: 'carrier1' },
        });

        expect(
            boardReducer(
                {
                    ...initialState,
                    cpuShips: { carrier1: ['A1', 'A2'] },
                    cpuMatchBoard: { ...initialState.cpuMatchBoard, cpuFields: { A1: { situation: 'SHIP', ship: 'carrier1' } } },
                },
                addPlayerMove('C1'),
            ).cpuFields,
        ).toEqual({
            C1: { situation: 'MISSED', ship: '' },
        });
    });

    it('should handle addCpuBoard', () => {
        expect(boardReducer(initialState, addCpuBoard({ columns: ['a', 'b'], rows: 2 })).cpuMatchBoard.playerLeftFieldsBoard).toEqual([
            'a0',
            'a1',
            'b0',
            'b1',
        ]);
    });

    it('should handle addCpuMove', () => {
        let state = boardReducer(
            { ...initialState, cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a0'] } },
            addCpuMove({ columns: ['a'], rows: 1 }),
        );
        expect(state.cpuMoves).toEqual(['a0']);
        expect(state.playerFields).toEqual({ a0: { situation: 'MISSED', ship: '' } });

        state = boardReducer(
            {
                ...initialState,
                playerFields: { a0: { situation: 'DESTROYED', ship: '' } },
                cpuMoves: ['a0'],
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a1'] },
            },
            addCpuMove({ columns: ['a'], rows: 2 }),
        );

        expect(state.cpuMoves).toEqual(['a0', 'a1']);
        expect(state.playerFields).toEqual({ a0: { situation: 'DESTROYED', ship: '' }, a1: { situation: 'MISSED', ship: '' } });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a0: { situation: 'HIT', ship: 'carrier1' },
                    a1: { situation: 'HIT', ship: 'carrier1' },
                    a2: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['a0', 'a1'],
                playerShips: { carrier1: ['a2'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a2'] },
            },
            addCpuMove({ columns: ['a'], rows: 3 }),
        );

        expect(state.cpuMoves).toEqual(['a0', 'a1', 'a2']);
        expect(state.playerFields).toEqual({
            a1: { situation: 'DESTROYED', ship: 'carrier1' },
            a0: { situation: 'DESTROYED', ship: 'carrier1' },
            a2: { situation: 'DESTROYED', ship: 'carrier1' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    b1: { situation: 'HIT', ship: 'carrier1' },
                    b2: { situation: 'HIT', ship: 'carrier1' },
                    b3: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['b1', 'b2'],
                playerShips: { carrier1: ['b3'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['b3', 'a2', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['b1', 'b2', 'b3']);
        expect(state.playerShips).toEqual({ carrier1: [] });
        expect(state.playerFields).toEqual({
            b1: { situation: 'DESTROYED', ship: 'carrier1' },
            b3: { situation: 'DESTROYED', ship: 'carrier1' },
            b2: { situation: 'DESTROYED', ship: 'carrier1' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a1: { situation: 'HIT', ship: 'carrier1' },
                    b1: { situation: 'SHIP', ship: 'carrier1' },
                    c3: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['a1'],
                playerShips: { carrier1: ['a1', 'b1', 'c1', 'd1'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['b1', 'c3', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['a1', 'b1']);
        expect(state.playerFields).toEqual({
            a1: { situation: 'HIT', ship: 'carrier1' },
            b1: { situation: 'HIT', ship: 'carrier1' },
            c3: { situation: 'SHIP', ship: 'carrier1' },
        });
    });

    it('should handle clearState', () => {
        expect(
            boardReducer(
                {
                    ...initialState,
                    cpuShips: { carrier1: ['A1'] },
                    cpuMatchBoard: { ...initialState.cpuMatchBoard, cpuFields: { A1: { situation: 'SHIP', ship: 'carrier1' } } },
                },
                clearState(),
            ),
        ).toEqual(initialState);
    });

    it('should handle all CPU moves after a missed', () => {
        let state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a2: { situation: 'HIT', ship: 'carrier1' },
                    b2: { situation: 'MISSED', ship: '' },
                    a1: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['a2', 'b2'],
                playerShips: { carrier1: ['a1', 'b1', 'c1', 'd1'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a1', 'c3', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['a2', 'b2', 'a1']);
        expect(state.playerFields).toEqual({
            a2: { situation: 'HIT', ship: 'carrier1' },
            b2: { situation: 'MISSED', ship: '' },
            a1: { situation: 'HIT', ship: 'carrier1' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    b3: { situation: 'HIT', ship: 'carrier1' },
                    c3: { situation: 'MISSED', ship: '' },
                    b2: { situation: 'MISSED', ship: 'carrier1' },
                    a3: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['c3', 'b3', 'b2'],
                playerShips: { carrier1: ['a1', 'b1', 'c1', 'd1'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a3', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['c3', 'b3', 'b2', 'a3']);
        expect(state.playerFields).toEqual({
            a3: { situation: 'HIT', ship: 'carrier1' },
            b3: { situation: 'HIT', ship: 'carrier1' },
            c3: { situation: 'MISSED', ship: '' },
            b2: { situation: 'MISSED', ship: 'carrier1' },
        });
        expect(state.cpuMatchBoard.playerLeftFieldsBoard).toEqual(['b6']);

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    b3: { situation: 'HIT', ship: 'carrier1' },
                    c3: { situation: 'MISSED', ship: '' },
                    b2: { situation: 'MISSED', ship: '' },
                    a3: { situation: 'MISSED', ship: '' },
                    b4: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['c3', 'b3', 'b2', 'a3'],
                playerShips: { carrier1: ['b4'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['b4', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['c3', 'b3', 'b2', 'a3', 'b4']);
        expect(state.playerFields).toEqual({
            a3: { situation: 'MISSED', ship: '' },
            b3: { situation: 'DESTROYED', ship: 'carrier1' },
            b4: { situation: 'DESTROYED', ship: 'carrier1' },
            c3: { situation: 'MISSED', ship: '' },
            b2: { situation: 'MISSED', ship: '' },
        });
        expect(state.cpuMatchBoard.playerLeftFieldsBoard).toEqual(['b6']);

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    b3: { situation: 'HIT', ship: 'carrier1' },
                    c3: { situation: 'MISSED', ship: '' },
                    b2: { situation: 'MISSED', ship: 'carrier1' },
                    a3: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['c3', 'b3', 'b2'],
                playerShips: { carrier1: ['a1', 'b1', 'c1', 'd1'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a3', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['c3', 'b3', 'b2', 'a3']);
        expect(state.playerFields).toEqual({
            a3: { situation: 'HIT', ship: 'carrier1' },
            b3: { situation: 'HIT', ship: 'carrier1' },
            c3: { situation: 'MISSED', ship: '' },
            b2: { situation: 'MISSED', ship: 'carrier1' },
        });
        expect(state.cpuMatchBoard.playerLeftFieldsBoard).toEqual(['b6']);

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    b3: { situation: 'HIT', ship: 'carrier1' },
                    c3: { situation: 'MISSED', ship: '' },
                    b2: { situation: 'MISSED', ship: '' },
                    a3: { situation: 'MISSED', ship: '' },
                    b4: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['c3', 'b3', 'b2', 'a3'],
                playerShips: { carrier1: ['b3', 'b4', 'b5'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['b4', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['c3', 'b3', 'b2', 'a3', 'b4']);
        expect(state.playerFields).toEqual({
            a3: { situation: 'MISSED', ship: '' },
            b3: { situation: 'HIT', ship: 'carrier1' },
            b4: { situation: 'HIT', ship: 'carrier1' },
            c3: { situation: 'MISSED', ship: '' },
            b2: { situation: 'MISSED', ship: '' },
        });
        expect(state.cpuMatchBoard.playerLeftFieldsBoard).toEqual(['b6']);
    });

    it('should handle Destroyed on cpu moves', () => {
        let state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a2: { situation: 'HIT', ship: 'carrier1' },
                    b2: { situation: 'HIT', ship: 'carrier1' },
                    c2: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['a2', 'b2'],
                playerShips: { carrier1: ['c2'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a1', 'c2', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['a2', 'b2', 'c2']);
        expect(state.playerFields).toEqual({
            a2: { situation: 'DESTROYED', ship: 'carrier1' },
            b2: { situation: 'DESTROYED', ship: 'carrier1' },
            c2: { situation: 'DESTROYED', ship: 'carrier1' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a2: { situation: 'SHIP', ship: 'carrier1' },
                    b2: { situation: 'HIT', ship: 'carrier1' },
                    c2: { situation: 'HIT', ship: 'carrier1' },
                    d2: { situation: 'MISSED', ship: '' },
                },
                cpuMoves: ['b2', 'c2', 'd2'],
                playerShips: { carrier1: ['a2'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a2', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c', 'd'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['b2', 'c2', 'd2', 'a2']);
        expect(state.playerFields).toEqual({
            a2: { situation: 'DESTROYED', ship: 'carrier1' },
            b2: { situation: 'DESTROYED', ship: 'carrier1' },
            d2: { situation: 'MISSED', ship: '' },
            c2: { situation: 'DESTROYED', ship: 'carrier1' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a2: { situation: 'MISSED', ship: '' },
                    b2: { situation: 'HIT', ship: 'carrier1' },
                    c2: { situation: 'HIT', ship: 'carrier1' },
                    d2: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['b2', 'c2', 'a2'],
                playerShips: { carrier1: ['d2', 'd3'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['d2', 'b6'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c', 'd'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['b2', 'c2', 'a2', 'd2']);
        expect(state.playerFields).toEqual({
            a2: { situation: 'MISSED', ship: '' },
            b2: { situation: 'HIT', ship: 'carrier1' },
            d2: { situation: 'HIT', ship: 'carrier1' },
            c2: { situation: 'HIT', ship: 'carrier1' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    b3: { situation: 'DESTROYED', ship: 'carrier1' },
                    c3: { situation: 'DESTROYED', ship: 'carrier1' },
                    b2: { situation: 'MISSED', ship: '' },
                    a3: { situation: 'DESTROYED', ship: 'carrier1' },
                },
                cpuMoves: ['c3', 'b3', 'b2', 'a3'],
                playerShips: { carrier1: [] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['b5'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['c3', 'b3', 'b2', 'a3', 'b5']);
        expect(state.playerFields).toEqual({
            b3: { situation: 'DESTROYED', ship: 'carrier1' },
            c3: { situation: 'DESTROYED', ship: 'carrier1' },
            b2: { situation: 'MISSED', ship: '' },
            a3: { situation: 'DESTROYED', ship: 'carrier1' },
            b5: { situation: 'MISSED', ship: '' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a2: { situation: 'SHIP', ship: 'carrier1' },
                    a3: { situation: 'HIT', ship: 'carrier1' },
                    a4: { situation: 'HIT', ship: 'carrier1' },
                    a5: { situation: 'MISSED', ship: '' },
                },
                cpuMoves: ['a3', 'a4', 'a5'],
                playerShips: { carrier1: ['a2'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a2'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c', 'd'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['a3', 'a4', 'a5', 'a2']);
        expect(state.playerFields).toEqual({
            a2: { situation: 'DESTROYED', ship: 'carrier1' },
            a3: { situation: 'DESTROYED', ship: 'carrier1' },
            a4: { situation: 'DESTROYED', ship: 'carrier1' },
            a5: { situation: 'MISSED', ship: '' },
        });

        state = boardReducer(
            {
                ...initialState,
                playerFields: {
                    a2: { situation: 'MISSED', ship: '' },
                    a3: { situation: 'HIT', ship: 'carrier1' },
                    a4: { situation: 'HIT', ship: 'carrier1' },
                    a5: { situation: 'SHIP', ship: 'carrier1' },
                },
                cpuMoves: ['a4', 'a3', 'a2'],
                playerShips: { carrier1: ['a5'] },
                cpuMatchBoard: { ...initialState.cpuMatchBoard, playerLeftFieldsBoard: ['a2', 'a5'] },
            },
            addCpuMove({ columns: ['a', 'b', 'c', 'd'], rows: 6 }),
        );

        expect(state.cpuMoves).toEqual(['a4', 'a3', 'a2', 'a5']);
        expect(state.playerFields).toEqual({
            a2: { situation: 'MISSED', ship: '' },
            a3: { situation: 'DESTROYED', ship: 'carrier1' },
            a4: { situation: 'DESTROYED', ship: 'carrier1' },
            a5: { situation: 'DESTROYED', ship: 'carrier1' },
        });
    });
});
