import { BehaviorSubject, Observable } from "rxjs";
import { first } from "rxjs/operators";

export class PlayerState {
    private _hp: number;
    public get hp(): number {
        return this._hp;
    }
    private _ap: BehaviorSubject<number>;
    public get ap(): Observable<number> {
        return this._ap;
    }
    public getAp(): number {
        return this._ap.value;
    }
    private _movingApSubject: BehaviorSubject<number | null>;
    public get movingAp(): Observable<number | null> {
        return this._movingApSubject;
    }
    private _isUser: boolean;
    public get isUser(): boolean {
        return this._isUser;
    }
    private _range: number;
    public get range(): number {
        return this._range;
    }
    constructor(
        readonly id: string,
        ap: number = 1,
        hp: number = 3,
        isUser: boolean = false,
        range: number = 3) {
        this._hp = hp;
        this._ap = new BehaviorSubject(ap);
        this._movingApSubject = new BehaviorSubject<number | null>(null);
        this._isUser = isUser;
        this._range = range;
    }
    public onHover(moveCount: number): void {
        this._movingApSubject.next(this._ap.value - moveCount);
    }
    public onDropped(): void {
        this._movingApSubject.next(null);
    }
    public addActionPoint(count: number = 1): void {
        this._ap.next(this._ap.value + count);
    }
    public onMoved(moveCount: number): void {
        this._ap.next(this._ap.value - moveCount);
    }
    public onAttacked(attackAp: number): void {
        this._hp = this._hp - attackAp;
    }
    public onUseAp(amount: number): void {
        const ap = this._ap.value;
        this._ap.next(ap - amount);
    }
}
