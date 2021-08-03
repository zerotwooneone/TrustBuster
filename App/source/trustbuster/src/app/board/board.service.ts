import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';
import { BusService } from '../bus/bus.service';
import { PlayerKilledEvent } from '../bus/event/player-killed-event';
import { PlayerMovedEvent } from '../bus/event/player-moved-event';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor(private readonly bus: BusService) { }

  //todo: move to player service
  public getPlayerKilled(): Observable<PlayerKilled> {
    return this.bus.subscribe<PlayerKilledEvent>(PlayerKilledEvent.eventName).pipe(
      map(e => new PlayerKilled(e.playerId))
    );
  }

  public async movePlayer(from: SpotState, to: SpotState): Promise<void> {
    const player = from.player;
    if (!player) {
      return;
    }
    if (!to.canAddPlayer()) {
      return;
    }

    const moveCount = this.getMoveCount(from, to);
    const playerAp = await player.ap.pipe(first()).toPromise();
    if (moveCount > playerAp) {
      return;
    }

    from.removePlayer();
    to.addPlayer(player);
    player.onMoved(moveCount);
    const playerMovedEvent = new PlayerMovedEvent(player.id, from.rowIndex, from.columnIndex, to.rowIndex, to.columnIndex);
    this.bus.publish<PlayerMovedEvent>(PlayerMovedEvent.eventName, playerMovedEvent);
  }

  public getMoveCount(from: SpotState, to: SpotState) {
    const dx = Math.max(from.columnIndex, to.columnIndex) - Math.min(from.columnIndex, to.columnIndex);
    const dy = Math.max(from.rowIndex, to.rowIndex) - Math.min(from.rowIndex, to.rowIndex);

    return Math.max(dx, dy);
  }

  public trackPlayer(id: string): Observable<PlayerMoved> {
    return this.bus.subscribe<PlayerMovedEvent>(PlayerMovedEvent.eventName).pipe(
      filter(e => e.playerId === id),
      map(e => new PlayerMoved(e.playerId, e.fromRow, e.fromColumn, e.toRow, e.toColumn))
    );
  }

  public getInRange(
    source: SpotState,
    target: Observable<TargetSpot>,
    rowCount: number,
    columnCount: number): Observable<boolean> {
    return target.pipe(
      map(playerMoved => {
        const range = source.player?.range ?? 0;
        if (range < 1) {
          return false;
        }

        const minX = Math.max(playerMoved.columnIndex - range, 0);
        const maxX = Math.min(playerMoved.columnIndex + range, columnCount);
        const minY = Math.max(playerMoved.rowIndex - range, 0);
        const maxY = Math.min(playerMoved.rowIndex + range, rowCount);

        return source.columnIndex >= minX &&
          source.columnIndex <= maxX &&
          source.rowIndex >= minY &&
          source.rowIndex <= maxY;
      })
    )

  }
}

export class PlayerKilled {
  constructor(public readonly playerId: string) { }
}

export class PlayerMoved {
  constructor(
    public readonly playerId: string,
    public readonly fromRow: number,
    public readonly fromColumn: number,
    public readonly toRow: number,
    public readonly toColumn: number) { }
}

export class TargetSpot {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number) { }
}
