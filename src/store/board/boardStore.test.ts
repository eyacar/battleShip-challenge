import boardReducer, { addPlayerFieldState, addCpuFieldState } from './index';

describe('User reducer', () => {
    it('should handle initial state', () => {
        expect(boardReducer(undefined, { type: 'unknown' })).toEqual({
            playerFields: {},
            cpuFields: {},
        });
    });

    it('should handle addPlayerFieldState', () => {
        expect(
            boardReducer({ playerFields: { A1: 'HIT' }, cpuFields: {} }, addPlayerFieldState({ fieldName: 'B4', fieldState: 'SHIP' }))
                .playerFields,
        ).toEqual({ A1: 'HIT', B4: 'SHIP' });
    });

    it('should handle addPlayerFieldState', () => {
        expect(
            boardReducer({ playerFields: {}, cpuFields: { J1: 'HIT' } }, addCpuFieldState({ fieldName: 'B4', fieldState: 'SHIP' }))
                .cpuFields,
        ).toEqual({ J1: 'HIT', B4: 'SHIP' });
    });
});
