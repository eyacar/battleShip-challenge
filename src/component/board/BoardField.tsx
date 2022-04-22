import React, { memo } from 'react';
import { useAppSelector } from '../../hook/reduxHooks';
import { FieldState } from '../../store/board/interfaces';

import style from './boardField.module.scss';

interface BoardFieldProps {
    fieldName: string;
    isPlayer: boolean;
    handleOnclick: (field: string) => void;
    handleHover?: (field: string, type: 'on' | 'off') => void;
}

const BoardField: React.FC<BoardFieldProps> = ({ fieldName, isPlayer, handleOnclick, handleHover }) => {
    const fieldState: FieldState = useAppSelector((state) =>
        isPlayer ? state.board.playerFields[fieldName] : state.board.cpuFields[fieldName],
    );

    const onHover = (type: 'on' | 'off') => {
        if (handleHover) {
            handleHover(fieldName, type);
        }
    };

    return (
        <td
            className={fieldState ? style[`container--${fieldState}`] : style.container}
            id={fieldName}
            data-testid={fieldName}
            onClick={() => handleOnclick(fieldName)}
            onMouseEnter={() => onHover('on')}
            onMouseLeave={() => onHover('off')}
        ></td>
    );
};

export default memo(BoardField);
