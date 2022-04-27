/* eslint-disable no-magic-numbers */
import BoardHelper from './BoardHelper';

describe('Board Helper', () => {
    const helper = new BoardHelper('A1');

    it('should handle CreateShip', () => {
        expect(
            helper.createShip(2, 'vertical', 'carrier', {
                columns: ['A', 'B', 'C', 'D', 'E'],
                rows: 5,
            }),
        ).toEqual({ A1: { situation: 'SHIP', ship: 'carrier' }, B1: { situation: 'SHIP', ship: 'carrier' } });

        expect(
            helper.createShip(3, 'horizontal', 'cruiser', {
                columns: ['A', 'B', 'C'],
                rows: 3,
            }),
        ).toEqual({
            A1: { situation: 'SHIP', ship: 'cruiser' },
            A2: { situation: 'SHIP', ship: 'cruiser' },
            A3: { situation: 'SHIP', ship: 'cruiser' },
        });
    });

    it('should CreateShip throw an undefined', () => {
        expect(
            helper.createShip(3, 'horizontal', 'cruiser', {
                columns: ['A', 'B', 'C'],
                rows: 2,
            }),
        ).toEqual(undefined);

        expect(
            helper.createShip(4, 'vertical', 'cruiser', {
                columns: ['A', 'B', 'C'],
                rows: 3,
            }),
        ).toEqual(undefined);
    });

    it('should handle areFieldPreviouslySelected with a used field', () => {
        expect(helper.areFieldPreviouslySelected(['B1', 'B3', 'B8'], ['A1', 'A2', 'A3', 'A4', 'A5'])).toBeFalsy();
    });

    it('should handle areFieldPreviouslySelected with a not used field', () => {
        expect(helper.areFieldPreviouslySelected(['A1', 'B3', 'B8'], ['A1', 'A2', 'A3', 'A4', 'A5'])).toBeTruthy();
    });
});
