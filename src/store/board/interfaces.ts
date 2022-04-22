export type FieldState = 'SHIP' | 'HIT' | 'DESTROYED' | 'MISSED';
export interface BOARD {
    playerFields: Record<string, FieldState>;
    cpuFields: Record<string, FieldState>;
}
