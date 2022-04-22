export type FieldState = 'SHIP' | 'HIT' | 'DESTROYED' | 'MISSED';
export interface BOARD {
    player: Record<string, FieldState>;
    cpu: Record<string, FieldState>;
}
