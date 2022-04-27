import boardReducer, { addPlayerShips, addCpuShips, addPlayerShipFields, addPlayerHoverState } from './index';
import { FieldState } from './interfaces';

describe('User reducer', () => {
    const prevState: Record<string, FieldState> = { A1: { situation: 'SHIP', ship: 'cruiser' } };

    it('should handle initial state', () => {
        expect(boardReducer(undefined, { type: 'unknown' })).toEqual({
            playerFields: {},
            cpuFields: {},
            playerShips: {},
            cpuShips: {},
        });
    });

    it('should handle addPlayerHoverState', () => {
        expect(
            boardReducer(
                { playerFields: prevState, cpuFields: {}, playerShips: {}, cpuShips: {} },
                addPlayerHoverState({
                    selected: { A4: { situation: 'SHIP', ship: 'cruiser' } },
                    WantToSelect: { A1: { situation: 'HIT', ship: 'carrier' } },
                }),
            ).playerFields,
        ).toEqual({ A1: { situation: 'HIT', ship: 'carrier' }, A4: { situation: 'SHIP', ship: 'cruiser' } });
    });

    it('should handle addPlayerShipFields', () => {
        expect(
            boardReducer(
                { playerFields: prevState, cpuFields: {}, playerShips: {}, cpuShips: {} },
                addPlayerShipFields({ A6: { situation: 'SHIP', ship: 'carrier' } }),
            ).playerFields,
        ).toEqual({ A1: { situation: 'SHIP', ship: 'cruiser' }, A6: { situation: 'SHIP', ship: 'carrier' } });
    });

    it('should handle addPlayerShips', () => {
        expect(
            boardReducer(
                { playerFields: {}, cpuFields: {}, playerShips: { carrier: ['d1', 'd2', 'd3'] }, cpuShips: {} },
                addPlayerShips({ ship: ['a1', 'b1', 'c1'] }),
            ).playerShips,
        ).toEqual({ carrier: ['d1', 'd2', 'd3'], ship: ['a1', 'b1', 'c1'] });
    });

    it('should handle addCpuShips', () => {
        const ships = { carrier: prevState, cruisers1: prevState, cruisers2: prevState, cruisers3: prevState, submarine: prevState };
        expect(boardReducer({ playerFields: {}, cpuFields: {}, playerShips: {}, cpuShips: {} }, addCpuShips(ships)).cpuFields).toEqual({
            ...prevState,
        });

        expect(boardReducer({ playerFields: {}, cpuFields: {}, playerShips: {}, cpuShips: {} }, addCpuShips(ships)).cpuShips).toEqual({
            carrier1: ['A1'],
            cruisers1: ['A1'],
            cruisers2: ['A1'],
            cruisers3: ['A1'],
            submarine1: ['A1'],
        });
    });
});
