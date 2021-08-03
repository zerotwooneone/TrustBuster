import { Observable } from "rxjs";
import { PlayerState } from "../player-state";

export class TargetActionParam {
    constructor(
        public readonly user: PlayerState,
        public readonly target: PlayerState | null,
        public isInRange: Observable<boolean>) { }
}
