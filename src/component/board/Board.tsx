import React, { memo } from 'react';
import hash from 'object-hash';
import BoardField from './BoardField';

interface BoardProps {
    columns: string[]; // Columns we ar going to get on the board.
    rowsAmount: number; // The amount of Rows we want for the board.
    isPlayer?: boolean; // If the board is for the player or not.
    handleOnclick: (field: string) => void; // The function that will be called when a field is clicked.
    handleHover?: (field: string, type: 'on' | 'off') => void;
}

const Board: React.FC<BoardProps> = ({ columns, rowsAmount, isPlayer = false, handleOnclick, handleHover }) => {
    return (
        <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
                {columns.map((column) => (
                    <tr data-testid={column} key={hash(column)}>
                        {Array(rowsAmount)
                            .fill(' ')
                            .map((_, i) => (
                                <BoardField
                                    key={hash(i)}
                                    fieldName={column + i}
                                    handleOnclick={handleOnclick}
                                    isPlayer={isPlayer}
                                    {...handleHover}
                                />
                            ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default memo(Board);
