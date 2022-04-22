import React, { memo } from 'react';
import { useAppSelector } from '../../hook/reduxHooks';
import { FieldState } from '../../store/board/interfaces';

import style from './boardField.module.scss';

interface BoardFieldProps {
    fieldName: string;
    isPlayer: boolean;
    handleOnclick: (field: string, isPlayer: boolean) => void;
}

const BoardField: React.FC<BoardFieldProps> = ({ fieldName, isPlayer, handleOnclick }) => {
    const fieldState: FieldState = useAppSelector((state) => (isPlayer ? state.board.player[fieldName] : state.board.cpu[fieldName]));

    return (
        <td
            className={fieldState ? style[`container--${fieldState}`] : style.container}
            data-testid={fieldName}
            onClick={() => handleOnclick(fieldName, isPlayer)}
            onMouseEnter={() => console.log(fieldName, 'true')}
            onMouseLeave={() => console.log(fieldName, 'false')}
        ></td>
    );
};

export default memo(BoardField);
