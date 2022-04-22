import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';

test('renders wip text', () => {
    const { getByText } = render(<Home />);

    expect(getByText('Work In Progress')).toBeInTheDocument();
});
