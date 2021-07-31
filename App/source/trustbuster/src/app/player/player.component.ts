import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PlayerState } from './player-state';

@Component({
  selector: 'tb-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public backgroundColor: string = 'initial';
  displayAp: Observable<number> | null = null;
  @Input() state: PlayerState = null as any;

  constructor() { }

  ngOnInit(): void {
    this.backgroundColor = this.stringToColour(this.state.id);

    //todo: make this work. show ap cost while moving

    this.displayAp = combineLatest([this.state.movingAp, this.state.ap]).pipe(
      map(both => {
        const movingAp = both[0];
        const ap = both[1];
        return movingAp == null ? ap : movingAp;
      }));

    this.state.movingAp.pipe(map(v => {
      //console.log(`r:${v == null ? this.state.ap : v} v:${v} ap:${this.state.ap}`);
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
