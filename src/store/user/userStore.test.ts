import userReducer, { addUserName } from './index';

describe('User reducer', () => {
    it('should handle initial state', () => {
        expect(userReducer(undefined, { type: 'unknown' })).toEqual({
            userName: '',
        });
    });

    it('should handle addUserName', () => {
        expect(userReducer(undefined, addUserName('Ezequiel')).userName).toEqual('Ezequiel');
    });
});
