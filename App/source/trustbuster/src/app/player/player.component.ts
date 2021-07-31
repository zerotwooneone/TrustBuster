import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PlayerState } from './player-state';
import { PlayerService } from './player.service';

@Component({
  selector: 'tb-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public backgroundColor: string = 'initial';
  displayAp: Observable<number> | null = null;
  @Input() state: PlayerState = null as any;

  constructor(private readonly playerService: PlayerService) { }

  ngOnInit(): void {
    this.backgroundColor = this.playerService.idToColour(this.state.id);

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
}
