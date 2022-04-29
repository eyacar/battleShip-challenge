import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import BoardField from './BoardField';

const handleHover = (field: string, type: 'on' | 'off') => {
    if (type === 'on') {
        document.body.innerHTML = `<div data-testid=${'hover-' + field}>X</div>`;
    }
    if (type === 'off') {
        document.body.innerHTML = `<div data-testid=${'hover-off-' + field}>X</div>`;
    }
};

beforeEach(() =>
    render(
        <Provider store={store}>
            <table>
                <tbody>
                    <tr>
                        {/*eslint-disable-next-line @typescript-eslint/no-empty-function */}
                        <BoardField fieldName={'a1'} handleOnclick={() => {}} handleHover={handleHover} isPlayer={false} />
                    </tr>
                </tbody>
            </table>
        </Provider>,
    ),
);

test('renders a board field and column', () => {
    expect(screen.getByTestId('a1-field-cpu').textContent).toBe('');
    expect(screen.getByTestId('a1-field-cpu').classList.contains('container')).toBe(true);
});

test('hovering on a field', () => {
    fireEvent.mouseEnter(screen.getByTestId('a1-field-cpu'));
    expect(screen.getByTestId('hover-a1'));
});

test('hovering off a field', () => {
    fireEvent.mouseLeave(screen.getByTestId('a1-field-cpu'));
    expect(screen.getByTestId('hover-off-a1'));
});
