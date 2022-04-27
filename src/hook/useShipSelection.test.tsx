import React, { useMemo } from 'react';
import { render, renderHook, act, screen, fireEvent } from '@testing-library/react';
import useShipSelection from './useShipSelection';

const TryHook = () => {
    const { handleOpenSelectionModal, modal, selection, addWarning, shipIsSelected } = useShipSelection();

    const selectionTest = useMemo(() => {
        if (selection)
            return (
                <>
                    {typeof selection === 'string'
                        ? selection
                        : `${selection.shipName} ${selection.position} ${selection.amountOfFields} ${selection.shipType}`}
                </>
            );
        return <></>;
    }, [selection]);

    return (
        <div>
            <span data-testid='open modal' onClick={handleOpenSelectionModal}>
                Add selection
            </span>
            <span data-testid='selected' onClick={shipIsSelected}>
                Selected
            </span>
            {modal}
            <div data-testid='selection'>{selectionTest}</div>
            {addWarning && addWarning}
        </div>
    );
};

describe('useShipSelection', () => {
    const { result } = renderHook(() => useShipSelection());

    it('should handle open Modal', () => {
        act(() => {
            result.current.handleOpenSelectionModal();
        });
        expect(result.current.modal.valueOf()).toBeTruthy();
    });
});

describe('Using useShipSelection inside a component', () => {
    beforeEach(() => render(<TryHook />));

    it('opening and closing modal', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        expect(screen.getByTestId('selection modal'));
        fireEvent.click(screen.getByTestId('close modal'));
        expect(screen.queryByTestId('selection modal')).toBeNull();
    });

    it('adding a carrier horizontal selection', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('carrier-horizontal'));
        expect(screen.getByTestId('selection').textContent).toBe('carrier1 horizontal 4 carrier');
        expect(screen.queryByTestId('selection modal')).toBeNull();
    });

    it('adding a carrier vertical selection', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('carrier-vertical'));
        expect(screen.getByTestId('selection').textContent).toBe('carrier1 vertical 4 carrier');
        expect(screen.queryByTestId('selection modal')).toBeNull();
    });

    it('adding cruisers horizontal selection', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-horizontal'));
        expect(screen.getByTestId('selection').textContent).toBe('cruisers3 horizontal 3 cruisers');
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-horizontal'));
        expect(screen.getByTestId('selection').textContent).toBe('cruisers2 horizontal 3 cruisers');
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-horizontal'));
        expect(screen.getByTestId('selection').textContent).toBe('cruisers1 horizontal 3 cruisers');
    });

    it('adding cruisers vertical selection', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-vertical'));
        expect(screen.getByTestId('selection').textContent).toBe('cruisers3 vertical 3 cruisers');
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-vertical'));
        expect(screen.getByTestId('selection').textContent).toBe('cruisers2 vertical 3 cruisers');
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-vertical'));
        expect(screen.getByTestId('selection').textContent).toBe('cruisers1 vertical 3 cruisers');
    });

    it('adding submarine horizontal selection', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('submarine-horizontal'));
        expect(screen.getByTestId('selection').textContent).toBe('submarine1 horizontal 2 submarine');
    });

    it('adding submarine vertical selection', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('submarine-vertical'));
        expect(screen.getByTestId('selection').textContent).toBe('submarine1 vertical 2 submarine');
    });

    it('warning is showing', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('submarine-vertical'));
        expect(screen.getByTestId('add warning'));
    });

    it('adding all the ships', () => {
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-vertical'));
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-vertical'));
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('cruisers-vertical'));
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('carrier-vertical'));
        fireEvent.click(screen.getByTestId('selected'));
        fireEvent.click(screen.getByTestId('open modal'));
        fireEvent.click(screen.getByTestId('submarine-vertical'));
        expect(screen.getByTestId('add warning').textContent).toBe('Add submarine before doing a new selection');
        fireEvent.click(screen.getByTestId('selected'));
        expect(screen.getByTestId('add warning').textContent).toBe('No More Ships to select');
        fireEvent.click(screen.getByTestId('open modal'));
        expect(screen.queryByTestId('selection modal')).toBeNull();
    });
});
