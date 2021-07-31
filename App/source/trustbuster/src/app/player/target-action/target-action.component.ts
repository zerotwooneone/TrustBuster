import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PlayerService } from '../player.service';
import { TargetActionParam } from './target-action-param';
import { TargetActionResult } from './target-action-result';

@Component({
  selector: 'tb-target-action',
  templateUrl: './target-action.component.html',
  styleUrls: ['./target-action.component.scss']
})
export class TargetActionComponent implements OnInit {

  private _targetColor: string = "";
  public get targetColor(): string {
    return this._targetColor;
  }

  constructor(private readonly bottomSheet: MatBottomSheetRef<TargetActionComponent, TargetActionResult>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public readonly param: TargetActionParam,
    private readonly playerService: PlayerService) { }

  ngOnInit(): void {
    //this.bottomSheet.dismiss(new TargetActionResult())
    if (this.param.spot.player) {
      const target = this.param.spot.player;
      this._targetColor = this.playerService.idToColour(target.id);
    }

  }

}
