export class PlayerKilledEvent {
    public static readonly eventName: string = "PlayerKilledEvent";
    constructor(public readonly playerId: string) { }
}