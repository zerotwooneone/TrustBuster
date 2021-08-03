export class PlayerMovedEvent {
    public static readonly eventName = "PlayerMovedEvent";
    constructor(
        public readonly playerId: string,
        public readonly fromRow: number,
        public readonly fromColumn: number,
        public readonly toRow: number,
        public readonly toColumn: number) { }
}