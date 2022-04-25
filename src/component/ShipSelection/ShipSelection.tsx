import React from 'react';
import Carrier from '../../asset/carrier.png';
import Cruisers from '../../asset/cruiser.png';
import Submarine from '../../asset/submarine.png';

import style from './shipSelection.module.scss';

export type Ships = 'carrier' | 'cruisers' | 'submarine';

interface ShipSelectionProps {
    shipName: Ships;
    handleSelection: (selectedShip: Ships, amountOfSpace: number, position: string) => void;
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
                    onClick={() => handleSelection(shipName, amountOfSpaceData.carrier, 'vertical')}
                    className={style.container__button_container__buttons}
                >
                    Vertical
                </button>
                <button
                    onClick={() => handleSelection(shipName, amountOfSpaceData.carrier, 'horizontal')}
                    className={style.container__button_container__buttons}
                >
                    Horizontal
                </button>
            </div>
        </div>
    );
};

export default ShipSelection;
