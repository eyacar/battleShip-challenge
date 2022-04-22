import React, { memo } from 'react';

import style from './boardField.module.scss';

interface BoardFieldProps {
    fieldName: string;
    isPlayer: boolean;
    color: Record<string, 'SHIP' | 'HIT' | 'DESTROYED' | 'MISSED'>;
    handleOnclick: (field: string, isPlayer: boolean) => void;
}

const BoardField: React.FC<BoardFieldProps> = ({ fieldName, isPlayer, handleOnclick, color }) => {
    // TODO : if isPlayer the redux state is going to be the players if is not is going to be CPU's

    const colorElement: 'SHIP' | 'HIT' | 'DESTROYED' | 'MISSED' = color[fieldName];
    return (
        <td
            className={colorElement ? style[`container--${colorElement}`] : style.container}
            data-testid={fieldName}
            onClick={() => handleOnclick(fieldName, isPlayer)}
            onMouseEnter={() => console.log(fieldName, 'true')}
            onMouseLeave={() => console.log(fieldName, 'false')}
        ></td>
    );
};

export default memo(BoardField);
