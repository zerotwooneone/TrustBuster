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
    removePlayer(): PlayerState | null {
        const player = this._player;
        this._player = null;
        return player;
    }
    addPlayer(player: PlayerState) {
        if (!this.canAddPlayer()) {
            throw new Error(`cannot add player ${player.id} because ${this._player?.id} already here.`);
        }
        this._player = player;
    }
    canAddPlayer(): boolean {
        return !this._player;
    }
}
