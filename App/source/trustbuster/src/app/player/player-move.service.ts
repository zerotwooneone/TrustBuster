import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';

@Injectable({
  providedIn: 'root'
})
export class PlayerMoveService {

  constructor() { }

  public async movePlayer(from: SpotState, to: SpotState) {
    const player = from.player;
    if (!player) {
      return;
    }
    if (!to.canAddPlayer()) {
      return;
    }

    const moveCount = this.getMoveCount(from, to);
    const playerAp = await player.ap.pipe(take(1)).toPromise();
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
