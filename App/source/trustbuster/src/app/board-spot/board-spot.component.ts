import { CdkDragEnter } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { SpotState } from './spot-state';

@Component({
  selector: 'tb-board-spot',
  templateUrl: './board-spot.component.html',
  styleUrls: ['./board-spot.component.scss']
})
export class BoardSpotComponent implements OnInit {

  @Input() spot: SpotState = null as any;

  constructor() { }

  ngOnInit(): void {
  }

}
