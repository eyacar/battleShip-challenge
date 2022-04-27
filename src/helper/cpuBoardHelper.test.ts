/* eslint-disable no-magic-numbers */
import CpuBoardHelper from '../helper/CpuBoardHelper';

describe('Board Helper', () => {
    const helper = new CpuBoardHelper(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], 10);

    const a = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'];
    const b = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'];
    const c = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'];
    const d = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
    const e = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'];
    const f = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'];
    const g = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'];
    const h = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'];
    const i = ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10'];
    const j = ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10'];

    const board = [...a, ...b, ...c, ...d, ...e, ...f, ...g, ...h, ...i, ...j];

    const cpuBoard = helper.createBoard();

    it('should handle createBoard', () => {
        expect(Object.keys(cpuBoard)).toStrictEqual(['carrier', 'cruisers1', 'cruisers2', 'cruisers3', 'submarine']);
    });

    it('should carrier have 4 fields', () => {
        expect(Object.keys(cpuBoard.carrier)).toHaveLength(4);
    });

    it('should cruisers have 3 fields', () => {
        expect(Object.keys(cpuBoard.cruisers1)).toHaveLength(3);
        expect(Object.keys(cpuBoard.cruisers2)).toHaveLength(3);
        expect(Object.keys(cpuBoard.cruisers3)).toHaveLength(3);
    });

    it('should submarine have 3 fields', () => {
        expect(Object.keys(cpuBoard.submarine)).toHaveLength(2);
    });

    const { carrier, cruisers1, cruisers2, cruisers3, submarine } = cpuBoard;
    const carrierFields = Object.keys(carrier);
    const cruisers1Fields = Object.keys(cruisers1);
    const cruisers2Fields = Object.keys(cruisers2);
    const cruisers3Fields = Object.keys(cruisers3);
    const submarineFields = Object.keys(submarine);

    it('cpu ships need to be on the board', () => {
        expect(board.includes(carrierFields[0])).toBeTruthy();
        expect(board.includes(carrierFields[1])).toBeTruthy();
        expect(board.includes(carrierFields[2])).toBeTruthy();
        expect(board.includes(carrierFields[3])).toBeTruthy();

        expect(board.includes(cruisers1Fields[0])).toBeTruthy();
        expect(board.includes(cruisers1Fields[1])).toBeTruthy();
        expect(board.includes(cruisers1Fields[2])).toBeTruthy();

        expect(board.includes(cruisers2Fields[0])).toBeTruthy();
        expect(board.includes(cruisers2Fields[1])).toBeTruthy();
        expect(board.includes(cruisers2Fields[2])).toBeTruthy();

        expect(board.includes(cruisers3Fields[0])).toBeTruthy();
        expect(board.includes(cruisers3Fields[1])).toBeTruthy();
        expect(board.includes(cruisers3Fields[2])).toBeTruthy();

        expect(board.includes(submarineFields[0])).toBeTruthy();
        expect(board.includes(submarineFields[1])).toBeTruthy();
    });

    it('cpu ships need to have different fields each', () => {
        expect(cruisers1Fields.includes(carrierFields[0])).toBeFalsy();
        expect(cruisers1Fields.includes(carrierFields[1])).toBeFalsy();
        expect(cruisers1Fields.includes(carrierFields[2])).toBeFalsy();
        expect(cruisers1Fields.includes(carrierFields[3])).toBeFalsy();

        expect(cruisers2Fields.includes(carrierFields[0])).toBeFalsy();
        expect(cruisers2Fields.includes(carrierFields[1])).toBeFalsy();
        expect(cruisers2Fields.includes(carrierFields[2])).toBeFalsy();
        expect(cruisers2Fields.includes(carrierFields[3])).toBeFalsy();

        expect(cruisers3Fields.includes(carrierFields[0])).toBeFalsy();
        expect(cruisers3Fields.includes(carrierFields[1])).toBeFalsy();
        expect(cruisers3Fields.includes(carrierFields[2])).toBeFalsy();
        expect(cruisers3Fields.includes(carrierFields[3])).toBeFalsy();

        expect(submarineFields.includes(carrierFields[0])).toBeFalsy();
        expect(submarineFields.includes(carrierFields[1])).toBeFalsy();
        expect(submarineFields.includes(carrierFields[2])).toBeFalsy();
        expect(submarineFields.includes(carrierFields[3])).toBeFalsy();

        expect(carrierFields.includes(cruisers1Fields[0])).toBeFalsy();
        expect(carrierFields.includes(cruisers1Fields[1])).toBeFalsy();
        expect(carrierFields.includes(cruisers1Fields[2])).toBeFalsy();

        expect(cruisers2Fields.includes(cruisers1Fields[0])).toBeFalsy();
        expect(cruisers2Fields.includes(cruisers1Fields[1])).toBeFalsy();
        expect(cruisers2Fields.includes(cruisers1Fields[2])).toBeFalsy();

        expect(cruisers3Fields.includes(cruisers1Fields[0])).toBeFalsy();
        expect(cruisers3Fields.includes(cruisers1Fields[1])).toBeFalsy();
        expect(cruisers3Fields.includes(cruisers1Fields[2])).toBeFalsy();

        expect(submarineFields.includes(cruisers1Fields[0])).toBeFalsy();
        expect(submarineFields.includes(cruisers1Fields[1])).toBeFalsy();
        expect(submarineFields.includes(cruisers1Fields[2])).toBeFalsy();

        expect(carrierFields.includes(cruisers2Fields[0])).toBeFalsy();
        expect(carrierFields.includes(cruisers2Fields[1])).toBeFalsy();
        expect(carrierFields.includes(cruisers2Fields[2])).toBeFalsy();

        expect(cruisers1Fields.includes(cruisers2Fields[0])).toBeFalsy();
        expect(cruisers1Fields.includes(cruisers2Fields[1])).toBeFalsy();
        expect(cruisers1Fields.includes(cruisers2Fields[2])).toBeFalsy();

        expect(cruisers3Fields.includes(cruisers2Fields[0])).toBeFalsy();
        expect(cruisers3Fields.includes(cruisers2Fields[1])).toBeFalsy();
        expect(cruisers3Fields.includes(cruisers2Fields[2])).toBeFalsy();

        expect(submarineFields.includes(cruisers2Fields[0])).toBeFalsy();
        expect(submarineFields.includes(cruisers2Fields[1])).toBeFalsy();
        expect(submarineFields.includes(cruisers2Fields[2])).toBeFalsy();

        expect(carrierFields.includes(cruisers3Fields[0])).toBeFalsy();
        expect(carrierFields.includes(cruisers3Fields[1])).toBeFalsy();
        expect(carrierFields.includes(cruisers3Fields[2])).toBeFalsy();

        expect(cruisers1Fields.includes(cruisers3Fields[0])).toBeFalsy();
        expect(cruisers1Fields.includes(cruisers3Fields[1])).toBeFalsy();
        expect(cruisers1Fields.includes(cruisers3Fields[2])).toBeFalsy();

        expect(cruisers2Fields.includes(cruisers3Fields[0])).toBeFalsy();
        expect(cruisers2Fields.includes(cruisers3Fields[1])).toBeFalsy();
        expect(cruisers2Fields.includes(cruisers3Fields[2])).toBeFalsy();

        expect(submarineFields.includes(cruisers3Fields[0])).toBeFalsy();
        expect(submarineFields.includes(cruisers3Fields[1])).toBeFalsy();
        expect(submarineFields.includes(cruisers3Fields[2])).toBeFalsy();

        expect(carrierFields.includes(submarineFields[0])).toBeFalsy();
        expect(carrierFields.includes(submarineFields[1])).toBeFalsy();

        expect(cruisers1Fields.includes(submarineFields[0])).toBeFalsy();
        expect(cruisers1Fields.includes(submarineFields[1])).toBeFalsy();

        expect(cruisers2Fields.includes(submarineFields[0])).toBeFalsy();
        expect(cruisers2Fields.includes(submarineFields[1])).toBeFalsy();

        expect(cruisers3Fields.includes(submarineFields[0])).toBeFalsy();
        expect(cruisers3Fields.includes(submarineFields[1])).toBeFalsy();
    });
});
