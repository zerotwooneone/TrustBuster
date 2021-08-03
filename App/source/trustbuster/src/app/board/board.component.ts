import { CdkDragDrop, CdkDragEnter, CdkDragSortEvent } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';
import { PlayerState } from '../player/player-state';
import { BoardState } from './board-state';
import { BoardService } from './board.service';

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
  private readonly initSubscriptions: Subscription[] = [];

  public userSpot: SpotState | null = null;
  public get user(): PlayerState {
    return this.state.user;
  }

  constructor(private readonly boardService: BoardService) { }

  async ngOnInit(): Promise<void> {
    this.columns = `repeat(${this.state.columnCount}, var(--grid-column-width, 0))`;
    this.rows = `repeat(${this.state.rowCount}, var(--grid-row-height, 0))`;

    this.initSubscriptions.push(this.state.user.ap
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
    ).subscribe());

    this.initSubscriptions.push(this.boardService.trackPlayer(this.state.user.id).subscribe(playerMoved => {
      const spot = this.getSpotByRc(playerMoved.toRow, playerMoved.toColumn);
      this.userSpot = spot;
    }))
  }
  private getSpotByRc(rowIndex: number, columnIndex: number): SpotState {
    const index = (rowIndex * this.state.columnCount) + columnIndex;
    return this.state.spots[index];
  }

  ngOnDestroy(): void {
    for (const subscription of this.initSubscriptions) {
      try {
        subscription.unsubscribe();
      } catch (e) {
        console.error(`error disposing: ${e}`);
      }
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

  public async drop(event: CdkDragDrop<SpotState>): Promise<void> {
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
        await this.boardService.movePlayer(from, to);
      }
    }
  }
  private async highlightInMoveRange(to: SpotState): Promise<void> {
    if (!to.player) {
      return;
    }
    const player = to.player;
    const ap = await player.ap.pipe(first()).toPromise();

    const minMoveX = Math.max(to.columnIndex - ap, 0);
    const maxMoveX = Math.min(to.columnIndex + ap, this.state.columnCount);
    const minMoveY = Math.max(to.rowIndex - ap, 0);
    const maxMoveY = Math.min(to.rowIndex + ap, this.state.rowCount);

    const range = ap > 0
      ? player.range
      : 0;

    const minAttackX = Math.max(to.columnIndex - range, 0);
    const maxAttackX = Math.min(to.columnIndex + range, this.state.columnCount);
    const minAttackY = Math.max(to.rowIndex - range, 0);
    const maxAttackY = Math.min(to.rowIndex + range, this.state.rowCount);

    for (const spot of this.state.spots) {
      if (
        spot.columnIndex >= minMoveX &&
        spot.columnIndex <= maxMoveX &&
        spot.rowIndex >= minMoveY &&
        spot.rowIndex <= maxMoveY) {
        spot.addMove();
      } else {
        spot.clearMove();
      }
      if (spot.player &&
        spot.player.id !== player.id &&
        spot.columnIndex >= minAttackX &&
        spot.columnIndex <= maxAttackX &&
        spot.rowIndex >= minAttackY &&
        spot.rowIndex <= maxAttackY) {
        spot.addAttackable();
      } else {
        spot.clearAttackable();
      }
    }
  }


  public enter(event: CdkDragEnter<SpotState>): void {
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
        const moveCount = this.boardService.getMoveCount(from, to);

        player.onHover(moveCount);
      }
    }
  }

}
