import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import Board from './Board';

const handleOnclick = (field: string) => {
    document.body.innerHTML = `<div data-testid=${'clicked-' + field}>X</div>`;
};

beforeEach(() =>
    render(
        <Provider store={store}>
            <Board columns={['h', 'j', 'm']} rowsAmount={4} handleOnclick={handleOnclick} isPlayer />
        </Provider>,
    ),
);

test('renders a board field and column', () => {
    expect(screen.getByTestId('h'));
    expect(screen.getByTestId('h3'));
    expect(screen.getByTestId('j'));
    expect(screen.getByTestId('j2'));
});

test('clicking on a field', () => {
    fireEvent.click(screen.getByTestId('h3'));
    expect(screen.getByTestId('clicked-h3'));
});
