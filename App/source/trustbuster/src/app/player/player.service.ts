import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { BusService } from '../bus/bus.service';
import { PlayerKilledEvent } from '../bus/event/player-killed-event';
import { PlayerState } from './player-state';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private readonly bus: BusService) { }

  public idToColour(str: string): string {
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
  public async attack(player: PlayerState, target: PlayerState, attackAp: number): Promise<void> {
    const playerAp = await player.ap.pipe(first()).toPromise();
    if (!player || !target || attackAp < 1) {
      return Promise.reject('argument error trying to attack');
    }
    if (playerAp < 1 || (playerAp - attackAp) < 0) {
      return Promise.reject('not enough ap to attack');
    }
    target.onAttacked(attackAp);
    await player.onUseAp(attackAp);
    if (target.hp < 1) {
      this.bus.publish(PlayerKilledEvent.eventName, new PlayerKilledEvent(target.id));
    }
  }
}
