import React, { memo } from 'react';
import { useAppSelector } from '../../hook/reduxHooks';
import { FieldSituation } from '../../store/board/interfaces';

import style from './boardField.module.scss';

interface BoardFieldProps {
    fieldName: string;
    isPlayer: boolean;
    handleOnclick: (field: string) => void;
    handleHover?: (field: string, type: 'on' | 'off') => void;
}

const BoardField: React.FC<BoardFieldProps> = ({ fieldName, isPlayer, handleOnclick, handleHover }) => {
    const boardState: 'playerFields' | 'cpuFields' = isPlayer ? 'playerFields' : 'cpuFields';

    const fieldState: FieldSituation = useAppSelector((state) => state.board[boardState][fieldName]?.situation);

    const onHover = (type: 'on' | 'off') => {
        if (handleHover) {
            handleHover(fieldName, type);
        }
    };

    return (
        <td
            className={fieldState ? style[`container--${fieldState}`] : style.container}
            id={fieldName}
            data-testid={fieldName + '-field'}
            onClick={() => handleOnclick(fieldName)}
            onMouseEnter={() => onHover('on')}
            onMouseLeave={() => onHover('off')}
        ></td>
    );
};

export default memo(BoardField);
