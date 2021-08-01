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
    private _userCanMove: boolean;
    public get userCanMove(): boolean {
        return this._userCanMove;
    }
    constructor(
        readonly id: number,
        readonly rowIndex: number,
        readonly columnIndex: number,
        readonly user: PlayerState,
        player: PlayerState | null = null) {
        this._player = player;
        this._isUserOrigin = false;
        this._userCanMove = false;
    }
    public removePlayer(): PlayerState | null {
        const player = this._player;
        this._player = null;
        return player;
    }
    public addPlayer(player: PlayerState): void {
        if (!this.canAddPlayer()) {
            throw new Error(`cannot add player ${player.id} because ${this._player?.id} already here.`);
        }
        this._player = player;
    }
    public canAddPlayer(): boolean {
        return !this._player;
    }
    public onPlayerDragged(): void {
        this._isUserOrigin = true;
    }
    public onPlayerDropped(): void {
        this._isUserOrigin = false;
    }
    public clearMove(): void {
        this._userCanMove = false;
    }
    public addMove(): void {
        this._userCanMove = true;
    }
}
