import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders a table with a h3 field', () => {
    render(<Home />);

    expect(screen.getAllByTestId('h3'));
});
