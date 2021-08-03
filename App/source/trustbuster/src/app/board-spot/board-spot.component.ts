import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { concat, of, Subscription } from 'rxjs';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';
import { BoardService, PlayerKilled, PlayerMoved, TargetSpot } from '../board/board.service';
import { PlayerState } from '../player/player-state';
import { PlayerService } from '../player/player.service';
import { TargetActionParam } from '../player/target-action/target-action-param';
import { TargetActionResult } from '../player/target-action/target-action-result';
import { TargetActionComponent } from '../player/target-action/target-action.component';
import { SpotState } from './spot-state';

@Component({
  selector: 'tb-board-spot',
  templateUrl: './board-spot.component.html',
  styleUrls: ['./board-spot.component.scss']
})
export class BoardSpotComponent implements OnInit, OnDestroy {

  @Input() spot: SpotState = null as any;
  @Input() userSpot: SpotState | null = null;
  @Input() user: PlayerState = null as any;
  private dismissedSubscription: Subscription | null = null;

  private readonly initSubscriptions: Subscription[] = [];

  constructor(private readonly bottomSheet: MatBottomSheet,
    private readonly playerService: PlayerService,
    private readonly boardService: BoardService) { }

  ngOnInit(): void {
    this.initSubscriptions.push(this.boardService.getPlayerKilled().subscribe(pk => this.onPlayerKilled(pk)));
  }

  ngOnDestroy(): void {
    if (this.dismissedSubscription) {
      this.dismissedSubscription.unsubscribe();
    }
    for (const subscription of this.initSubscriptions) {
      try {
        subscription.unsubscribe();
      } catch (e) {
        console.error(`error disposing: ${e}`);
      }
    }
  }

  public async onClick(): Promise<void> {
    const userAp = await this.user.ap.pipe(first()).toPromise();
    if (!this.spot.player ||
      this.spot.player.isUser ||
      userAp < 1 ||
      !this.userSpot) {
      return;
    }
    const target = this.spot.player;
    const targetPlayerId = target.id;
    const config = new MatBottomSheetConfig<TargetActionParam>();
    const targetSpot = concat(
      of(new TargetSpot(this.spot.rowIndex, this.spot.columnIndex)),
      this.boardService.trackPlayer(this.spot.player.id).pipe(map(e => new TargetSpot(e.toRow, e.toColumn)))
    );
    const targetRc = targetSpot;
    const isInRange = this.boardService.getInRange(this.userSpot, targetRc, this.spot.rowCount, this.spot.columnCount).pipe(
      shareReplay(1)
    );

    config.data = new TargetActionParam(this.user, this.spot.player, isInRange);
    const bottomSheet = this.bottomSheet.open<TargetActionComponent, TargetActionParam, TargetActionResult>(
      TargetActionComponent,
      config);
    this.dismissedSubscription = bottomSheet.afterDismissed()
      .subscribe(result => {
        this.dismissedSubscription = null;
        //the state of the board may have changed since the target-action was opened, recheck everything
        if (result &&
          target &&
          target.id === targetPlayerId &&
          this.user) {
          if (result.attackAp != null) {
            return this.playerService.attack(this.user, target, result.attackAp);
          }
          if (result.transferAp != null) {
            return this.playerService.transfer(this.user, target, result.transferAp);
          }
        }
      });

  }

  private onPlayerKilled(pk: PlayerKilled): void {
    if (this.spot.player && this.spot.player.id === pk.playerId) {
      this.spot.removePlayer();
    }
  }

}
