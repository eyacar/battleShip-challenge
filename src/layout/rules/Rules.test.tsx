import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { useAppDispatch } from '../../hook/reduxHooks';
import { addUserName } from '../../store/user';
import Rules from './Rules';

const TestRules = () => {
    const dispatch = useAppDispatch();
    return (
        <Provider store={store}>
            <Router>
                <div data-testid='addName' onClick={() => dispatch(addUserName('test'))}>
                    addName
                </div>
                <Rules />
            </Router>
        </Provider>
    );
};

beforeEach(() => {
    render(
        <Provider store={store}>
            <TestRules />
        </Provider>,
    );
});

describe('Rules', () => {
    it('should render the Rules page', () => {
        // eslint-disable-next-line no-magic-numbers
        expect(screen.getAllByTestId('rules')).toHaveLength(1);
    });

    it('should render Go Home button', () => {
        expect(screen.getByTestId('navigate button').textContent).toBe('Go Home');
    });

    it('should render Go Home button', () => {
        fireEvent.click(screen.getByTestId('addName'));
        expect(screen.getByTestId('navigate button').textContent).toBe('Go To match');
    });
});
