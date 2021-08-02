import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';
import { BusService } from '../bus/bus.service';
import { PlayerKilledEvent } from '../bus/event/player-killed-event';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private readonly bus: BusService) { }

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
  }

  public getMoveCount(from: SpotState, to: SpotState) {
    const dx = Math.max(from.columnIndex, to.columnIndex) - Math.min(from.columnIndex, to.columnIndex);
    const dy = Math.max(from.rowIndex, to.rowIndex) - Math.min(from.rowIndex, to.rowIndex);

    return Math.max(dx, dy);
  }
}

export class PlayerKilled {
  constructor(public readonly playerId: string) { }
}
