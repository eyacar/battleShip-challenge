/* eslint-disable no-magic-numbers */
import { FieldState } from '../store/board/interfaces';

type Field = Record<string, FieldState>;

export interface CpuShips {
    carrier: Field;
    cruisers1: Field;
    cruisers2: Field;
    cruisers3: Field;
    submarine: Field;
}

export default class CpuBoardHelper {
    private fieldList: string[];
    private columns: string[];
    constructor(columns: string[], rows: number) {
        this.fieldList = this.setFieldList(columns, rows);
        this.columns = columns;
    }

    private setFieldList(columns: string[], rows: number) {
        return columns.reduce(
            (acc: string[], column: string) => [
                ...acc,
                ...Array(rows)
                    .fill(' ')
                    // eslint-disable-next-line no-magic-numbers
                    .map((_, i) => `${column}${i + 1}`),
            ],
            [],
        );
    }

    private getRandomField(): string {
        // For getting a random field on the not used fields on Cpu Board.
        const randomIndex = Math.floor(Math.random() * this.fieldList.length);
        const randomField = this.fieldList[randomIndex];
        return randomField;
    }

    private getPosition(): string {
        const position = ['horizontal', 'vertical'];
        return position[Math.floor(Math.random() * position.length)]; // For getting a random number between 0 and 1.
    }

    private fieldHorizontalShipCreator(column: string, row: string, spacesFromInitialField: number, shipName: string): Field {
        // I create each field of the ship first checking if the field is not used before.
        return this.fieldList.includes(column + (Number(row) + spacesFromInitialField))
            ? { [column + (Number(row) + spacesFromInitialField)]: { situation: 'SHIP', ship: shipName } }
            : {};
    }

    private fieldVerticalShipCreator(
        column: string,
        row: string,
        spacesFromInitialField: number,
        shipName: string,
    ): Record<string, FieldState> {
        // I create each field of the ship first checking if the field is not used before.
        const columnIndex = this.columns.indexOf(column);
        return this.fieldList.includes(this.columns[columnIndex + spacesFromInitialField] + row)
            ? { [this.columns[columnIndex + spacesFromInitialField] + row]: { situation: 'SHIP', ship: shipName } }
            : {};
    }

    private getShip(numberOfShip: number, type: 'carrier' | 'cruisers' | 'submarine'): Field {
        const position = this.getPosition();
        const randomField = this.getRandomField();

        const COLUMN_POSITION = 1;
        const ROW_POSITION = 0;
        const column = randomField[ROW_POSITION];
        const row = randomField[COLUMN_POSITION];
        const carrierName = type + numberOfShip;

        let shipFields: Field;

        if (position === 'horizontal') {
            const initialField = this.fieldHorizontalShipCreator(column, row, 0, carrierName);
            let secondField = this.fieldHorizontalShipCreator(column, row, 1, carrierName);
            let thirdField = this.fieldHorizontalShipCreator(column, row, 2, carrierName);
            let fourthField = this.fieldHorizontalShipCreator(column, row, 3, carrierName);

            secondField = Number(secondField[1]) < 10 ? secondField : {};
            thirdField = Number(thirdField[1]) < 10 ? thirdField : {};
            fourthField = Number(fourthField[1]) < 10 ? fourthField : {};

            shipFields = this.createShip(type, { initialField, secondField, thirdField, fourthField });
        } else {
            // Vertical position
            const initialField = this.fieldVerticalShipCreator(column, row, 0, carrierName);
            const secondField = this.fieldVerticalShipCreator(column, row, 1, carrierName);
            const thirdField = this.fieldVerticalShipCreator(column, row, 2, carrierName);
            const fourthField = this.fieldVerticalShipCreator(column, row, 3, carrierName);
            shipFields = this.createShip(type, { initialField, secondField, thirdField, fourthField });
        }

        return shipFields;
    }

    private isUsedField(field: string): boolean {
        return this.fieldList.includes(field);
    }

    private createShip(
        shipType: string,
        fields: { initialField: Field; secondField: Field; thirdField: Field; fourthField: Field },
    ): Field {
        let shipFields: Field;
        let areNotUsedFields: boolean;
        // To get each field name.
        const initialFieldName = Object.keys(fields.initialField)[0];
        const secondFieldName = Object.keys(fields.secondField)[0];
        const thirdFieldName = Object.keys(fields.thirdField)[0];
        const fourthFieldName = Object.keys(fields.fourthField)[0];
        if (shipType === 'carrier') {
            areNotUsedFields =
                this.isUsedField(initialFieldName) &&
                Boolean(secondFieldName) &&
                this.isUsedField(secondFieldName) &&
                Boolean(thirdFieldName) &&
                this.isUsedField(thirdFieldName) &&
                Boolean(fourthFieldName) &&
                this.isUsedField(fourthFieldName);

            if (areNotUsedFields) {
                this.fieldList = this.fieldList.filter(
                    (field) =>
                        field !== initialFieldName && field !== secondFieldName && field !== thirdFieldName && field !== fourthFieldName,
                ); // For getting off the used fields from the list.
                shipFields = {
                    ...fields.initialField,
                    ...fields.secondField,
                    ...fields.thirdField,
                    ...fields.fourthField,
                };
            } else shipFields = {}; // if one is used is going to send an empty object.
        } else if (shipType === 'cruisers') {
            areNotUsedFields =
                this.isUsedField(initialFieldName) &&
                Boolean(secondFieldName) &&
                this.isUsedField(secondFieldName) &&
                Boolean(thirdFieldName) &&
                this.isUsedField(thirdFieldName);

            if (areNotUsedFields) {
                this.fieldList = this.fieldList.filter(
                    (field) => field !== initialFieldName && field !== secondFieldName && field !== thirdFieldName,
                ); // For getting off the used fields from the list.
                shipFields = {
                    ...fields.initialField,
                    ...fields.secondField,
                    ...fields.thirdField,
                };
            } else shipFields = {}; // if one is used is going to send an empty object.
        } else {
            // submarine
            areNotUsedFields =
                this.isUsedField(initialFieldName) &&
                Boolean(secondFieldName) &&
                this.isUsedField(secondFieldName) &&
                Boolean(thirdFieldName) &&
                this.isUsedField(thirdFieldName);

            if (areNotUsedFields) {
                this.fieldList = this.fieldList.filter((field) => field !== initialFieldName && field !== secondFieldName); // For getting off the used fields from the list.
                shipFields = {
                    ...fields.initialField,
                    ...fields.secondField,
                };
            } else shipFields = {}; // if one is used is going to send an empty object.
        }
        return shipFields;
    }

    createBoard(): CpuShips {
        let carrier: Field = {};
        // The while loop are used because when the random field are used the ship is not created we get an empty object instead.
        while (Object.keys(carrier).length < 4) {
            carrier = this.getShip(1, 'carrier');
        }

        let cruisers1: Field = {};

        while (Object.keys(cruisers1).length < 3) {
            cruisers1 = this.getShip(1, 'cruisers');
        }

        let cruisers2: Field = {};

        while (Object.keys(cruisers2).length < 3) {
            cruisers2 = this.getShip(2, 'cruisers');
        }

        let cruisers3: Field = {};

        while (Object.keys(cruisers3).length < 3) {
            cruisers3 = this.getShip(3, 'cruisers');
        }

        let submarine: Field = {};

        while (Object.keys(submarine).length < 2) {
            submarine = this.getShip(1, 'submarine');
        }

        return { carrier, cruisers1, cruisers2, cruisers3, submarine };
    }
}
