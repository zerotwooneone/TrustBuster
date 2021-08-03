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
  public attack(player: PlayerState, target: PlayerState, attackAp: number): void {
    if (!player || !target || attackAp < 1) {
      return;
    }
    const playerAp = player.getAp();
    if (playerAp < 1 || (playerAp - attackAp) < 0) {
      throw new Error('not enough ap to attack');
    }
    target.onAttacked(attackAp);
    player.onUseAp(attackAp);
    if (target.hp < 1) {
      this.bus.publish(PlayerKilledEvent.eventName, new PlayerKilledEvent(target.id));
    }
  }

  public transfer(player: PlayerState, target: PlayerState, transferAp: number): void {
    if (!player || !target || transferAp < 1) {
      return;
    }
    const playerApSnapshot = player.getAp();
    if (playerApSnapshot < 1 || (playerApSnapshot - transferAp) < 0) {
      throw new Error(`not enough ap to transfer`);
    }
    player.onUseAp(transferAp);
    target.addActionPoint(transferAp);
  }
}
