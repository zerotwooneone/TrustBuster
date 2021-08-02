import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSliderChange } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { PlayerService } from '../player.service';
import { TargetActionParam } from './target-action-param';
import { TargetActionResult } from './target-action-result';

@Component({
  selector: 'tb-target-action',
  templateUrl: './target-action.component.html',
  styleUrls: ['./target-action.component.scss']
})
export class TargetActionComponent implements OnInit, OnDestroy {

  public confirmValue: number = 0;
  private _targetColor: string = "";
  public get targetColor(): string {
    return this._targetColor;
  }
  public attackAp: number = 1;

  //todo:why cant we await the user.ap? I think every time we await, another change detection occurs
  private userAp: number = 0;
  private userApSubscription: Subscription | null = null;

  constructor(private readonly bottomSheet: MatBottomSheetRef<TargetActionComponent, TargetActionResult>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public readonly param: TargetActionParam,
    private readonly playerService: PlayerService) { }

  ngOnInit(): void {
    if (this.param.spot.player) {
      const target = this.param.spot.player;
      this._targetColor = this.playerService.idToColour(target.id);
    }
    this.userApSubscription = this.param.spot.user.ap.subscribe(ap => this.userAp = ap);
  }

  ngOnDestroy(): void {
    if (this.userApSubscription) {
      this.userApSubscription.unsubscribe();
    }
  }

  public onConfirmChange(event: MatSliderChange) {
    if (event.value == null || event.value < 100) {
      //todo: why doesn't this work?
      this.confirmValue = 0;
      return;
    }
    this.bottomSheet.dismiss(new TargetActionResult(this.attackAp));
  }

  public addAttackAp(): void {
    this.attackAp++;
  }

  public removeAttackAp(): void {
    this.attackAp--;
  }

  public removeAttackDisabled(): boolean {

    return this.attackAp <= 1;
  }

  public addAttackDisabled(): boolean {
    return this.attackAp >= this.userAp;
  }

}
