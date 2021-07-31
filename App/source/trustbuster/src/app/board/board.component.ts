import { CdkDragDrop, CdkDragEnter, CdkDragSortEvent } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';
import { BoardState } from './board-state';

@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @HostBinding('style.grid-template-rows') rows: string = '';
  @HostBinding('style.grid-template-columns') columns: string = '';
  @HostBinding('style.--grid-column-width') columnWidth: string = '';

  @Input() state: BoardState = null as any;

  constructor() {

  }

  ngOnInit(): void {
    this.columns = `repeat(${this.state.columnCount}, var(--grid-column-width, 0))`;

    this.rows = `repeat(${this.state.rowCount}, var(--grid-row-height, 0))`;
  }

  async drop(event: CdkDragDrop<SpotState>): Promise<undefined> {
    if (event.item?.dropContainer?.data) {
      const from = event.item.dropContainer.data as SpotState;
      const player = from.player;
      if (!player) {
        return;
      }
      player.onDropped();
      from.onPlayerDropped();
      // if (!from.canRemovePlayer()) {
      //   console.warn(`cannot remove player from:${from.rowIndex},${from.columnIndex}`);
      //   return;
      // }
      if (event.container?.data) {
        const to = event.container.data;
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
      }
    }
    return;
  }

  enter(event: CdkDragEnter<SpotState>) {
    if (event.item?.dropContainer?.data) {
      const from = event.item.dropContainer.data as SpotState;
      const player = from.player;
      if (!player) {
        return;
      }
      from.onPlayerDragged();
      // if (!from.canRemovePlayer()) {
      //   console.warn(`cannot remove player from:${from.rowIndex},${from.columnIndex}`);
      //   return;
      // }
      if (event.container?.data) {
        const to = event.container.data;
        const moveCount = this.getMoveCount(from, to);

        player.onHover(moveCount);
      }
    }
  }


  private getMoveCount(from: SpotState, to: SpotState) {
    const dx = Math.max(from.columnIndex, to.columnIndex) - Math.min(from.columnIndex, to.columnIndex);
    const dy = Math.max(from.rowIndex, to.rowIndex) - Math.min(from.rowIndex, to.rowIndex);

    return Math.max(dx, dy);
  }
}
