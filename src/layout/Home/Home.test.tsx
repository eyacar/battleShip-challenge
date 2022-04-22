import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import Home from './Home';

test('renders a table with a h3 field', () => {
    render(
        <Provider store={store}>
            <Home />
        </Provider>,
    );

    expect(screen.getAllByTestId('h3'));
});
