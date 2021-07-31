import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { TargetActionParam } from '../player/target-action/target-action-param';
import { TargetActionResult } from '../player/target-action/target-action-result';
import { TargetActionComponent } from '../player/target-action/target-action.component';
import { SpotState } from './spot-state';

@Component({
  selector: 'tb-board-spot',
  templateUrl: './board-spot.component.html',
  styleUrls: ['./board-spot.component.scss']
})
export class BoardSpotComponent implements OnInit {

  @Input() spot: SpotState = null as any;

  constructor(private readonly bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
  }

  public onClick(): void {
    if (this.spot.player && !this.spot.player.isUser) {
      const config = new MatBottomSheetConfig<TargetActionParam>();
      config.data = new TargetActionParam(this.spot);
      const bottomSheet = this.bottomSheet.open<TargetActionComponent, TargetActionParam, TargetActionResult>(
        TargetActionComponent,
        config);

    }
  }

}
