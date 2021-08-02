import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusService } from '../bus/bus.service';
import { PlayerKilledEvent } from '../bus/event/player-killed-event';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private readonly bus: BusService) { }

  public getPlayerKilled(): Observable<PlayerKilled> {
    return this.bus.subscribe<PlayerKilledEvent>(PlayerKilledEvent.eventName).pipe(
      map(e => new PlayerKilled(e.playerId))
    );
  }
}

export class PlayerKilled {
  constructor(public readonly playerId: string) { }
}
