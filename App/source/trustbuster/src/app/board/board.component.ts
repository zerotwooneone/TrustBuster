import { CdkDragDrop, CdkDragEnter, CdkDragSortEvent } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';
import { PlayerMoveService } from '../player/player-move.service';
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

  constructor(private readonly playerMove: PlayerMoveService) { }

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
      //player.onDropped();
      from.onPlayerDropped();
      // if (!from.canRemovePlayer()) {
      //   console.warn(`cannot remove player from:${from.rowIndex},${from.columnIndex}`);
      //   return;
      // }
      if (event.container?.data) {
        const to = event.container.data;
        await this.playerMove.movePlayer(from, to);
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
        const moveCount = this.playerMove.getMoveCount(from, to);

        player.onHover(moveCount);
      }
    }
  }



}
