import { BehaviorSubject, Observable } from "rxjs";

export class PlayerState {
    private _hp: number;
    public get hp(): number {
        return this._hp;
    }
    private _ap: BehaviorSubject<number>;
    public get ap(): Observable<number> {
        return this._ap;
    }
    private _movingApSubject: BehaviorSubject<number | null>;
    public get movingAp(): Observable<number | null> {
        return this._movingApSubject;
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
        this._ap = new BehaviorSubject(ap);
        this._movingApSubject = new BehaviorSubject<number | null>(null);
        this._isUser = isUser;
    }
    onHover(moveCount: number) {
        this._movingApSubject.next(this._ap.value - moveCount);
    }
    onDropped() {
        this._movingApSubject.next(null);
    }
    addActionPoint() {
        this._ap.next(this._ap.value + 1);
    }
    onMoved(moveCount: number) {
        this._ap.next(this._ap.value - moveCount);
    }
}
