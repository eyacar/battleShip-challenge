import React from 'react';
import Carrier from '../../asset/carrier.png';
import Cruisers from '../../asset/cruiser.png';
import Submarine from '../../asset/submarine.png';

import style from './shipSelection.module.scss';

export type Ships = 'carrier' | 'cruisers' | 'submarine';

interface ShipSelectionProps {
    shipName: Ships;
    handleSelection: (selectedShip: Ships, amountOfSpace: number, position: 'vertical' | 'horizontal') => void;
}

const ShipSelection: React.FC<ShipSelectionProps> = ({ shipName, handleSelection }) => {
    const amountOfSpaceData = {
        carrier: 4,
        cruisers: 3,
        submarine: 2,
    };

    const shipImage = {
        carrier: Carrier,
        cruisers: Cruisers,
        submarine: Submarine,
    };

    return (
        <div className={style.container}>
            <img src={shipImage[shipName]} alt={shipName} width='200' height='150'></img>
            <div className={style.container__button_container}>
                <h2>{shipName}</h2>
                <button
                    data-testid={shipName + '-vertical'}
                    onClick={() => handleSelection(shipName, amountOfSpaceData[shipName], 'vertical')}
                    className={style.container__button_container__buttons + ' btn btn-outline-dark'}
                >
                    Vertical
                </button>
                <button
                    data-testid={shipName + '-horizontal'}
                    onClick={() => handleSelection(shipName, amountOfSpaceData[shipName], 'horizontal')}
                    className={style.container__button_container__buttons + ' btn btn-outline-dark'}
                >
                    Horizontal
                </button>
            </div>
        </div>
    );
};

export default ShipSelection;
