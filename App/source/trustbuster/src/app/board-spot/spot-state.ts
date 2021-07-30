import { PlayerState } from "../player/player-state";

export class SpotState {
    private _player: PlayerState | null;
    public get player(): PlayerState | null {
        return this._player;
    }
    private _isUserOrigin: boolean;
    public get isUserOrigin(): boolean {
        return this._isUserOrigin;
    }
    constructor(
        readonly id: number,
        readonly rowIndex: number,
        readonly columnIndex: number,
        player: PlayerState | null = null) {
        this._player = player;
        this._isUserOrigin = false;
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
    onPlayerDragged() {
        this._isUserOrigin = true;
    }
    onPlayerDropped() {
        this._isUserOrigin = false;
    }
}
