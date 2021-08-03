import { SpotState } from "../board-spot/spot-state";
import { PlayerState } from "../player/player-state";

export class BoardState {
    public readonly rowCount: number = 10;
    public readonly columnCount: number = 10;
    private _spots: SpotState[];
    public get spots(): readonly SpotState[] {
        return this._spots;
    }
    private _user: PlayerState;
    public get user(): PlayerState {
        return this._user;
    }
    private _otherPlayers: readonly PlayerState[];
    public get otherPlayers(): readonly PlayerState[] {
        return this._otherPlayers;
    }
    private _players: readonly PlayerState[];
    public get players(): readonly PlayerState[] {
        return this._players;
    }

    constructor(user: PlayerState,
        otherPlayers: readonly PlayerState[]) {
        //todo: get real data
        this._user = user;
        this._otherPlayers = otherPlayers;
        this._players = [user, ...otherPlayers];

        const playersCopy = [...this._players];

        const spotIndexes = Array.from(Array(this.rowCount * this.columnCount).keys());
        this._spots = spotIndexes.map(i => {
            const rowIndex = Math.floor(i / this.columnCount);
            const columnIndex = i % this.columnCount;

            const randomPick = (Math.floor((Math.random() * this.rowCount * this.columnCount)) < 2);
            const runningOutOfSpace: boolean = !!playersCopy.length && ((spotIndexes.length - i) <= playersCopy.length);
            if (runningOutOfSpace) {
                console.warn(`ran out of space players:${playersCopy.length} currentSpot:${i}`)
            }
            const player = (randomPick || runningOutOfSpace)
                ? this.removeRandomPlayer(playersCopy)
                : null;
            const spot = new SpotState(i, rowIndex, columnIndex, this.rowCount, this.columnCount, player);
            return spot;
        });
    }
    removeRandomPlayer(players: PlayerState[]): PlayerState {
        if (players.length === 1) {
            const player = players[0];
            players.length = 0;
            return player;
        }
        const toRemoveIndex = Math.floor(Math.random() * players.length);
        const player = players[toRemoveIndex];
        players.splice(toRemoveIndex, 1);
        return player;
    }

    onAddActionPoint() {
        //todo: improve this
        for (const spot of this._spots) {
            if (spot.player) {
                spot.player.addActionPoint();
            }
        }
    }
}
