import { Component, Input, OnInit } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PlayerState } from './player-state';

@Component({
  selector: 'tb-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public backgroundColor: string = 'initial';
  getAp: Observable<number> | null = null;
  @Input() state: PlayerState = null as any;

  constructor() { }

  ngOnInit(): void {
    this.backgroundColor = this.stringToColour(this.state.id);
    this.getAp = this.state.movingAp.pipe(map(v => {
      console.log(`r:${v == null ? this.state.ap : v} v:${v} ap:${this.state.ap}`);
      return v == null ? this.state.ap : v;
    }),
      shareReplay(1));
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
