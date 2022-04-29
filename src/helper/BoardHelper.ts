import { FieldState } from '../store/board/interfaces';

export default class BoardHelper {
    private field: string;
    constructor(field: string) {
        this.field = field; // the field where i'm right now with hover or by clicking.
    }

    createShip(
        amountOfFields: number,
        position: 'vertical' | 'horizontal',
        shipName: string,
        boardData: { columns: string[]; rows: number },
    ): Record<string, FieldState> | undefined {
        const { columns, rows } = boardData; //  For checking if the ship is in the board and not outside
        const COLUMN_POSITION = 1;
        const ROW_POSITION = 0;
        const column = this.field[ROW_POSITION];
        const row = this.field[COLUMN_POSITION];
        let ship: Record<string, FieldState> | undefined;

        if (position === 'vertical') {
            const columnIndex = columns.indexOf(column);

            if (columnIndex + amountOfFields <= columns.length) {
                // check first if the ship is in the board
                const fields = Array(amountOfFields)
                    .fill(' ')
                    .reduce((acc, _, i) => ({ ...acc, [columns[columnIndex + i] + row]: { situation: 'SHIP', ship: shipName } }), {});
                return (ship = fields);
            }
        }

        // eslint-disable-next-line no-magic-numbers
        if (position === 'horizontal' && Number(row) - 1 + amountOfFields < rows) {
            // check first if the ship is in the board
            // row - 1 --> because in order to know the amount of rows you are going to need to subtract 1 from the initial row
            const fields = Array(amountOfFields)
                .fill(' ')
                .reduce((acc, _, i) => ({ ...acc, [column + (Number(row) + Number(i))]: { situation: 'SHIP', ship: shipName } }), {});
            return (ship = fields);
        }

        return ship;
    }

    areFieldPreviouslySelected(selectedFields: string[], wantedFields: string[]): boolean {
        let isPreviouslySelected = false;

        for (const field of wantedFields) {
            if (selectedFields.includes(field)) {
                isPreviouslySelected = true;
                break;
            } else {
                isPreviouslySelected = false;
            }
        }
        return isPreviouslySelected;
    }
}
