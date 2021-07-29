import { Component, Input, OnInit } from '@angular/core';
import { PlayerState } from './player-state';

@Component({
  selector: 'tb-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() state: PlayerState = null as any;

  constructor() { }

  ngOnInit(): void {
  }

}
