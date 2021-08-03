import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSliderChange } from '@angular/material/slider';
import { Observable, of, Subscription } from 'rxjs';
import { PlayerService } from '../player.service';
import { TargetActionParam } from './target-action-param';
import { TargetActionResult } from './target-action-result';

@Component({
  selector: 'tb-target-action',
  templateUrl: './target-action.component.html',
  styleUrls: ['./target-action.component.scss']
})
export class TargetActionComponent implements OnInit, OnDestroy {

  public attackConfirmValue: number = 0;
  public transferConfirmValue: number = 0;
  public readonly target: PlayerVm;
  public readonly user: PlayerVm;
  public attackAp: number = 1;
  public transferAp: number = 0;

  //todo:why cant we await the user.ap? I think every time we await, another change detection occurs
  private userAp: number = 0;
  private userApSubscription: Subscription | null = null;

  constructor(private readonly bottomSheet: MatBottomSheetRef<TargetActionComponent, TargetActionResult>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private readonly param: TargetActionParam,
    private readonly playerService: PlayerService) {
    const targetId = param.spot.player
      ? param.spot.player.id
      : "";
    const targetColor = playerService.idToColour(targetId);
    const targetHp = param.spot.player?.hp ?? 0;
    const targetAp = param.spot.player?.ap ?? of(0);
    this.target = new PlayerVm(
      targetColor,
      targetHp,
      targetAp);

    const userId = param.spot.user
      ? param.spot.user.id
      : "";
    const userColor = playerService.idToColour(userId)
    this.user = new PlayerVm(
      userColor,
      param.spot.user.hp,
      param.spot.user.ap)
  }

  ngOnInit(): void {
    this.userApSubscription = this.param.spot.user.ap.subscribe(ap => this.userAp = ap);
  }

  ngOnDestroy(): void {
    if (this.userApSubscription) {
      this.userApSubscription.unsubscribe();
    }
  }

  public onConfirmAttack(event: MatSliderChange) {
    if (event.value == null || event.value < 100) {
      //todo: why doesn't this work?
      this.attackConfirmValue = 0;
      return;
    }
    this.bottomSheet.dismiss(new TargetActionResult(this.attackAp, null));
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
    return this.attackAp >= this.userAp ||
      this.attackAp >= this.target.hp;
  }

  public addTransferAp(): void {
    this.transferAp++;
    this.setTransferAp();
  }

  public removeTransferAp(): void {
    this.transferAp--;
    this.setTransferAp();
  }

  private setTransferAp() {
    const userApSnapshot = this.param.spot.user.getAp();
    if (this.transferAp > userApSnapshot) {
      this.transferAp = userApSnapshot;
    }
    if (userApSnapshot === 0) {
      this.transferAp = 0;
    }
  }

  public removeTransferDisabled(): boolean {
    this.setTransferAp();
    return this.transferAp <= 1;
  }

  public addTransferDisabled(): boolean {
    this.setTransferAp();
    const userApSnapshot = this.param.spot.user.getAp();
    return this.transferAp >= userApSnapshot;
  }

  public afterUserAp(): number {
    const userApSnapshot = this.param.spot.user.getAp();
    return userApSnapshot - this.transferAp;
  }

  public afterTargetAp(): number {
    const targetApSnapshot = this.param.spot.player?.getAp() ?? 0;
    return targetApSnapshot + this.transferAp;
  }

  public onConfirmTransfer(event: MatSliderChange) {
    if (event.value == null || event.value < 100) {
      //todo: why doesn't this work?
      this.transferConfirmValue = 0;
      return;
    }
    this.bottomSheet.dismiss(new TargetActionResult(null, this.transferAp));
  }

}

class PlayerVm {
  constructor(
    public readonly color: string,
    public readonly hp: number,
    public readonly ap: Observable<number>) { }
}
