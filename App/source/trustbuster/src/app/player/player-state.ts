export class PlayerState {
    private _hp: number;
    public get hp(): number {
        return this._hp;
    }
    private _ap: number;
    public get ap(): number {
        return this._ap;
    }
    constructor(
        readonly id: string,
        ap: number = 1,
        hp: number = 3,) {
        this._hp = hp;
        this._ap = ap;
    }
}
