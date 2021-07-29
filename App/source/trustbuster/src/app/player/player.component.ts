import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { PlayerState } from './player-state';

@Component({
  selector: 'tb-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @HostBinding('style.background-color') backgroundColor: string = '';
  @Input() state: PlayerState = null as any;

  constructor() { }

  ngOnInit(): void {
    this.backgroundColor = this.stringToColour(this.state.id);
  }

  private stringToColour(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (let i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

}
