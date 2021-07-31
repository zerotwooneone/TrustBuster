import { CdkDragDrop, CdkDragEnter, CdkDragSortEvent } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';
import { PlayerMoveService } from '../player/player-move.service';
import { BoardState } from './board-state';

@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  @HostBinding('style.grid-template-rows') rows: string = '';
  @HostBinding('style.grid-template-columns') columns: string = '';
  @HostBinding('style.--grid-column-width') columnWidth: string = '';

  @Input() state: BoardState = null as any;
  private apSubscription: Subscription | null = null;

  constructor(private readonly playerMove: PlayerMoveService) { }

  async ngOnInit(): Promise<void> {
    this.columns = `repeat(${this.state.columnCount}, var(--grid-column-width, 0))`;
    this.rows = `repeat(${this.state.rowCount}, var(--grid-row-height, 0))`;

    this.apSubscription = this.state.user.ap
      .pipe(
        map(ap => this.findPlayerSpotById(this.state.user.id)),
        filter(fr => fr.found),
        map(fr => {
          if (fr.found) {
            return fr.spot;
          }
          console.error(`spot not found, but also not filtered ${fr}`);
          return undefined as any as SpotState;
        }),
        switchMap(spot => {
          return this.highlightInMoveRange(spot);
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.apSubscription) {
      this.apSubscription.unsubscribe();
    }
  }

  private findPlayerSpotById(id: string): { found: true, spot: SpotState } | { found: false } {
    for (const spot of this.state.spots) {
      if (spot.player && spot.player.id === id) {
        return { found: true, spot };
      }
    }
    return { found: false };
  }

  async drop(event: CdkDragDrop<SpotState>): Promise<void> {
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
        await this.playerMove.movePlayer(from, to);
      }
    }
  }
  async highlightInMoveRange(to: SpotState): Promise<void> {
    if (!to.player) {
      return;
    }
    const player = to.player;
    const ap = await player.ap.pipe(first()).toPromise();

    const minX = Math.max(to.columnIndex - ap, 0);
    const maxX = Math.min(to.columnIndex + ap, this.state.columnCount);
    const minY = Math.max(to.rowIndex - ap, 0);
    const maxY = Math.min(to.rowIndex + ap, this.state.rowCount);

    for (const spot of this.state.spots) {
      if (!spot.player &&
        spot.columnIndex >= minX &&
        spot.columnIndex <= maxX &&
        spot.rowIndex >= minY &&
        spot.rowIndex <= maxY) {
        spot.addMove();
        continue;
      }
      spot.clearMove();
    }
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
