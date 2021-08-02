import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { EMPTY, Subscription } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
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
  private dismissedSubscription: Subscription | null = null;

  constructor(private readonly bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.dismissedSubscription) {
      this.dismissedSubscription.unsubscribe();
    }
  }

  public async onClick(): Promise<void> {
    const userAp = await this.spot.user.ap.pipe(first()).toPromise();
    if (!this.spot.player ||
      this.spot.player.isUser ||
      userAp < 1) {
      return;
    }
    const targetPlayerId = this.spot.player.id;
    const config = new MatBottomSheetConfig<TargetActionParam>();
    config.data = new TargetActionParam(this.spot);
    const bottomSheet = this.bottomSheet.open<TargetActionComponent, TargetActionParam, TargetActionResult>(
      TargetActionComponent,
      config);
    this.dismissedSubscription = bottomSheet.afterDismissed()
      .pipe(
        switchMap(result => {
          this.dismissedSubscription = null;
          if (result &&
            this.spot.player &&
            this.spot.player.id === targetPlayerId) {
            this.spot.player.onAttacked(result.attackAp);
            return this.spot.user.onUseAp(result.attackAp);
          }
          return EMPTY;
        })
      )
      .subscribe();

  }

}
