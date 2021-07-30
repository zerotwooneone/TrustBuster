export class PlayerState {
    private _hp: number;
    public get hp(): number {
        return this._hp;
    }
    private _ap: number;
    public get ap(): number {
        return this._ap;
    }
    private _isUser: boolean;
    public get isUser(): boolean {
        return this._isUser;
    }
    constructor(
        readonly id: string,
        ap: number = 1,
        hp: number = 3,
        isUser: boolean = false) {
        this._hp = hp;
        this._ap = ap;
        this._isUser = isUser;
    }
}
