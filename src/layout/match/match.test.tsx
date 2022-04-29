/* eslint-disable no-magic-numbers */
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hook/reduxHooks';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { addPlayerShips, addCpuShips } from '../../store/board/';
import Match from './Match';
import { addUserName } from '../../store/user';

const TestMatch = () => {
    const playerFields = useAppSelector((state) => state.board.playerFields);
    const cpuFields = useAppSelector((state) => state.board.cpuFields);
    const cpuMoves = useAppSelector((state) => state.board.cpuMoves);
    const userName = useAppSelector((state) => state.user.userName);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(addUserName('Test'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h1 data-testid='username'>{userName ? userName : 'none'}</h1>
            {cpuMoves.length > 0 && <h1 data-testid='cpuHavemoves'></h1>}
            {Object.keys(playerFields).length > 0 && <h1 data-testid='cpuMove'></h1>}
            {Object.keys(cpuFields).length > 0 && <h1 data-testid='PlayerMove'></h1>}
            <h1
                data-testid='addEmptyShips'
                onClick={() => {
                    dispatch(addPlayerShips({ carrier1: [], cruisers1: [], cruisers2: [], cruisers3: [], submarine1: [] }));
                    dispatch(
                        addCpuShips({
                            carrier: {},
                            cruisers1: { a1: { situation: 'SHIP', ship: 'cruisers1' } },
                            cruisers2: {},
                            cruisers3: {},
                            submarine: {},
                        }),
                    );
                }}
            ></h1>
            <h1
                data-testid='addCpuEmptyShips'
                onClick={() => {
                    dispatch(addPlayerShips({ carrier1: ['a2'], cruisers1: [], cruisers2: [], cruisers3: [], submarine1: [] }));
                    dispatch(
                        addCpuShips({
                            carrier: {},
                            cruisers1: {},
                            cruisers2: {},
                            cruisers3: {},
                            submarine: {},
                        }),
                    );
                }}
            ></h1>
            <Match />
        </>
    );
};

describe('Match', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TestMatch />
                </BrowserRouter>
            </Provider>,
        );
    });

    it('should handle cpu moves', () => {
        expect(screen.getByText('Welcome Test Play The Match')).toBeInTheDocument();
        expect(screen.getByTestId('playing').textContent).toBe('Playing: Test');
        fireEvent.click(screen.getByTestId('a3-field-cpu'));
        expect(screen.getByTestId('PlayerMove').textContent);
        expect(screen.queryByTestId('cpuHavemoves')).toBeNull();
        expect(screen.getByTestId('playing').textContent).toBe('Playing: CPU');
        const ONE_SECONDS_DELAY = 2500;
        setTimeout(function () {
            expect(screen.getByTestId('cpuMove').textContent);
            expect(screen.getByTestId('cpuHavemoves')).toBeInTheDocument();
            expect(screen.getByTestId('playing').textContent).toBe('Playing: Test');
        }, ONE_SECONDS_DELAY);
    });

    it('should handle Match functionality', () => {
        fireEvent.click(screen.getByTestId('addEmptyShips'));
        expect(screen.getByTestId('winner').textContent).toBe('Cpu WON!  🏆🏅🎉');
        fireEvent.click(screen.getByTestId('addCpuEmptyShips'));
        expect(screen.getByTestId('winner').textContent).toBe('Test WON!  🏆🏅🎉');
        expect(screen.getByText('Re Play')).toBeInTheDocument();
        expect(screen.getByTestId('username').textContent).toBe('Test');
        fireEvent.click(screen.getByTestId('Re Play'));
        expect(screen.getByTestId('username').textContent).toBe('none');
    });
});
