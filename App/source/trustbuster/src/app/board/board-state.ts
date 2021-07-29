import { SpotState } from "../board-spot/spot-state";
import { PlayerState } from "../player/player-state";

export class BoardState {
    public readonly rowCount: number = 10;
    public readonly columnCount: number = 10;
    private _spots: SpotState[];
    public get spots(): SpotState[] {
        return this._spots;
    }

    constructor() {
        //todo: get real data
        this._spots = Array.from(Array(this.rowCount * this.columnCount).keys()).map(i => {
            const rowIndex = Math.floor(i / this.columnCount);
            const columnIndex = i % this.columnCount;
            const playerId = this.makeid(12);

            const randApMax = 3
            const ap = Math.floor(Math.random() * randApMax) + Math.floor(Math.random() * 2);

            const hp = 1 + Math.floor(Math.random() * 2);

            const player = Math.floor((Math.random() * this.rowCount * this.columnCount)) < 2
                ? new PlayerState(playerId, ap, hp)
                : null;
            return new SpotState(i, rowIndex, columnIndex, player);
        });
    }

    private makeid(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}
