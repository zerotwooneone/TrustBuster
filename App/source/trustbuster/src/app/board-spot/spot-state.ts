import { PlayerState } from "../player/player-state";

export class SpotState {
    private _player: PlayerState | null;
    public get player(): PlayerState | null {
        return this._player;
    }
    constructor(
        readonly id: number,
        readonly rowIndex: number,
        readonly columnIndex: number,
        player: PlayerState | null = null) {
        this._player = player;
    }
}
