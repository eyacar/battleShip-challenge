/* eslint-disable no-magic-numbers */
import React from 'react';
import { useAppSelector } from '../../hook/reduxHooks';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import Home from './Home';

describe('Home', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>,
        );
    });

    it('should render the Rules page', () => {
        // eslint-disable-next-line no-magic-numbers
        expect(screen.getAllByTestId(/\*?-field/i)).toHaveLength(100);
        expect(screen.getByTestId('home'));
    });

    it('opening and closing modal', () => {
        fireEvent.click(screen.getByTestId('Add a Ship'));
        expect(screen.getByTestId('selection modal'));
        fireEvent.click(screen.getByTestId('close modal'));
        expect(screen.queryByTestId('selection modal')).toBeNull();
    });
});

const TestHome = () => {
    const playerFields = useAppSelector((state) => state.board.playerFields);
    const userName = useAppSelector((state) => state.user.userName);
    return (
        <>
            {playerFields &&
                Object.keys(playerFields).map((element, i) => (
                    <h1 data-testid={element + '-test'} key={i}>
                        {element}
                    </h1>
                ))}
            {userName && <h1 data-testid={'userName'}>{userName}</h1>}
            <Home />
        </>
    );
};

describe('Home trying redux states', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <TestHome />
            </Provider>,
        );
    });

    it('hover on a field', () => {
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('submarine-horizontal'));
        fireEvent.mouseOver(screen.getByTestId('a1-field'));
        expect(screen.getByTestId('a1-field').classList.contains('container--SHIP')).toBeTruthy();
        expect(screen.getByTestId('a2-field').classList.contains('container--SHIP')).toBeTruthy();
        expect(screen.getByTestId('a1-test')).toBeTruthy();
        expect(screen.getByTestId('a2-test')).toBeTruthy();
    });

    it('select a hover State', () => {
        fireEvent.mouseEnter(screen.getByTestId('d1-field'));
        expect(screen.queryByTestId('d1-test')).toBeNull();
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('submarine-horizontal'));
        fireEvent.mouseEnter(screen.getByTestId('d1-field'));
        expect(screen.getByTestId('d1-test')).toBeTruthy();
        fireEvent.mouseLeave(screen.getByTestId('d1-field'));
        expect(screen.queryByTestId('d1-test')).toBeNull();
        fireEvent.mouseEnter(screen.getByTestId('a1-field'));
        fireEvent.click(screen.getByTestId('a1-field'));
        expect(screen.getByTestId('a1-test')).toBeTruthy();
        expect(screen.getByTestId('a2-test')).toBeTruthy();
    });

    it('should handle click', () => {
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('submarine-horizontal'));
        fireEvent.mouseOver(screen.getByTestId('d1-field'));
        fireEvent.click(screen.getByTestId('d1-field'));
        expect(screen.getByTestId('d1-test')).toBeTruthy();
        expect(screen.getByTestId('d2-test')).toBeTruthy();
    });

    it('test Add Ship button', () => {
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('submarine-horizontal'));
        expect(screen.getByTestId('add warning').textContent).toBe('Add submarine before doing a new selection');
        fireEvent.mouseOver(screen.getByTestId('a1-field'));
        fireEvent.click(screen.getByTestId('a1-field'));
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('carrier-horizontal'));
        expect(screen.getByTestId('add warning').textContent).toBe('Add carrier before doing a new selection');
        fireEvent.mouseOver(screen.getByTestId('b1-field'));
        fireEvent.click(screen.getByTestId('b1-field'));
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('cruisers-horizontal'));
        expect(screen.getByTestId('add warning').textContent).toBe('Add cruisers before doing a new selection');
        fireEvent.mouseOver(screen.getByTestId('c1-field'));
        fireEvent.click(screen.getByTestId('c1-field'));
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('cruisers-horizontal'));
        fireEvent.mouseOver(screen.getByTestId('d1-field'));
        fireEvent.click(screen.getByTestId('d1-field'));
        fireEvent.click(screen.getByTestId('Add a Ship'));
        fireEvent.click(screen.getByTestId('cruisers-horizontal'));
        fireEvent.mouseOver(screen.getByTestId('e1-field'));
        fireEvent.click(screen.getByTestId('e1-field'));
        expect(screen.getByTestId('No More Ship').textContent).toBe('No More Ships to select');
        fireEvent.change(screen.getByTestId(/Add Name input/i), { target: { value: 'Eze' } });
        fireEvent.click(screen.getByTestId('Start Game'));
        expect(screen.getByTestId('userName').textContent).toBe('Eze');
    });
});
