export type FieldSituation = 'SHIP' | 'HIT' | 'DESTROYED' | 'MISSED';
export interface FieldState {
    situation: FieldSituation;
    ship: string;
}

interface CpuMatchBoard {
    cpuFields: Record<string, FieldState>;
    playerLeftFieldsBoard: string[];
}
export interface BOARD {
    playerFields: Record<string, FieldState>;
    cpuFields: Record<string, FieldState>;
    playerShips: Record<string, string[]>;
    cpuShips: Record<string, string[]>;
    cpuMatchBoard: CpuMatchBoard;
    playerMoves: string[];
    cpuMoves: string[];
}
