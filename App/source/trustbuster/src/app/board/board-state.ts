import { SpotState } from "../board-spot/spot-state";
import { PlayerState } from "../player/player-state";

export class BoardState {
    public readonly rowCount: number = 10;
    public readonly columnCount: number = 10;
    private _spots: SpotState[];
    public get spots(): SpotState[] {
        return this._spots;
    }

    constructor(user: PlayerState,
        otherPlayers: readonly PlayerState[]) {
        //todo: get real data
        const players = [user, ...otherPlayers];
        const spotIndexes = Array.from(Array(this.rowCount * this.columnCount).keys());
        this._spots = spotIndexes.map(i => {
            const rowIndex = Math.floor(i / this.columnCount);
            const columnIndex = i % this.columnCount;

            const randomPick = (Math.floor((Math.random() * this.rowCount * this.columnCount)) < 2);
            const runningOutOfSpace: boolean = !!players.length && ((spotIndexes.length - i) <= players.length);
            if (runningOutOfSpace) {
                console.warn(`ran out of space players:${players.length} currentSpot:${i}`)
            }
            const player = (randomPick || runningOutOfSpace)
                ? this.getRandomPlayer(players)
                : null;

            return new SpotState(i, rowIndex, columnIndex, player);
        });
    }
    getRandomPlayer(players: PlayerState[]): PlayerState {
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
