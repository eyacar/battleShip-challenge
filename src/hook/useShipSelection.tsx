/* eslint-disable no-magic-numbers */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ShipSelection, { Ships } from '../component/ShipSelection/ShipSelection';

import style from './style/shipSelectionPortal.module.scss';

type POSITION = 'vertical' | 'horizontal';
interface ShipsPlayerCouldAdd {
    carrier: number;
    cruisers: number;
    submarine: number;
}

export interface Selected {
    shipName: string;
    position: POSITION;
    amountOfFields: number;
    shipType: string;
}

export default function useShipSelection() {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [shipsPlayerCouldAdd, setShipsPlayerCouldAdd] = useState<ShipsPlayerCouldAdd>({
        carrier: 1,
        cruisers: 3,
        submarine: 1,
    });

    const [selection, setSelection] = useState<Selected | 'initialState' | 'No More Ships to select' | ''>('');

    useEffect(() => {
        const { carrier, cruisers, submarine } = shipsPlayerCouldAdd;
        if (!selection && carrier === 0 && cruisers === 0 && submarine === 0) {
            setSelection('No More Ships to select');
        }
    }, [shipsPlayerCouldAdd, selection]);

    const handleOpenSelectionModal = () => {
        // For opening the modal
        if (!selection || selection === 'initialState') {
            setIsOpened(true);
        }
    };

    const handleSelection = useCallback(
        (selectedShip: Ships, amountOfSpace: number, position: POSITION) => {
            // This handler set the selected state of what the player wants to add.
            setSelection({
                shipName: selectedShip + shipsPlayerCouldAdd[selectedShip],
                position: position,
                amountOfFields: amountOfSpace,
                shipType: selectedShip,
            });
            setShipsPlayerCouldAdd((prevState) => ({ ...prevState, [selectedShip]: prevState[selectedShip] - 1 }));
            setIsOpened(false);
        },
        [shipsPlayerCouldAdd],
    );

    const shipIsSelected = () => {
        // When the user make the selection this function trigger that the modal can be opened again.
        setSelection('');
    };

    const carrier = useMemo(() => {
        if (shipsPlayerCouldAdd.carrier > 0) {
            return <ShipSelection shipName='carrier' handleSelection={handleSelection} />;
        }
    }, [shipsPlayerCouldAdd.carrier, handleSelection]);

    const cruisers = useMemo(() => {
        if (shipsPlayerCouldAdd.cruisers > 0) {
            return <ShipSelection shipName='cruisers' handleSelection={handleSelection} />;
        }
    }, [shipsPlayerCouldAdd.cruisers, handleSelection]);

    const submarine = useMemo(() => {
        if (shipsPlayerCouldAdd.submarine > 0) {
            return <ShipSelection shipName='submarine' handleSelection={handleSelection} />;
        }
    }, [shipsPlayerCouldAdd.submarine, handleSelection]);

    const addWarning = useMemo(() => {
        if (selection === 'No More Ships to select') {
            return <div data-testid='add warning'>No More Ships to select</div>;
        } else if (selection && selection !== 'initialState') {
            return <div data-testid='add warning'>Add {selection.shipType} before doing a new selection</div>;
        }
    }, [selection]);

    const modal =
        isOpened &&
        createPortal(
            <div className={style.container} data-testid='selection modal'>
                <div className={style.container__modal}>
                    <span data-testid='close modal' onClick={() => setIsOpened(false)} className={style.container__modal__close}>
                        X
                    </span>
                    <h2>Choose your next selection:</h2>
                    {carrier}
                    {cruisers}
                    {submarine}
                </div>
            </div>,
            document.body,
        );

    return { handleOpenSelectionModal, modal, selection, addWarning, shipIsSelected };
}
