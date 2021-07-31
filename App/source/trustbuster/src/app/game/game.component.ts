import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { SpotState } from '../board-spot/spot-state';
import { BoardState } from '../board/board-state';
import { PlayerMoveService } from '../player/player-move.service';
import { PlayerState } from '../player/player-state';

@Component({
  selector: 'tb-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private _boardState: BoardState = null as any;
  public get boardState(): BoardState {
    return this._boardState;
  }
  private _otherPlayers: PlayerState[] = [];
  private _user: PlayerState = null as any;

  constructor(private readonly playerMove: PlayerMoveService) { }

  ngOnInit(): void {
    //todo: get game state
    this._user = this.createPlayer(true);
    this._otherPlayers = Array.from(Array(Math.floor(Math.random() * 3) + 1)).map(i => {
      return this.createPlayer();
    });
    this._boardState = new BoardState(this._user, this._otherPlayers);
  }

  onAddActionPoint(): void {
    this.boardState.onAddActionPoint();
  }

  onMoveOthers(): void {
    const spotsWithOtherPlayers = this.boardState.spots.reduce<SpotState[]>((acc, cur) => {
      if (cur.player && !cur.player.isUser) {
        acc.push(cur);
      }
      return acc;
    }, []);
    for (const from of spotsWithOtherPlayers) {
      if (!from.player) {
        continue;
      }
      const otherPlayer = from.player;
      otherPlayer.ap.pipe(first()).subscribe(async ap => {
        if (ap > 0) {
          const to = this.findRandomMove(from, ap);
          if (to) {
            await this.playerMove.movePlayer(from, to);
          }
        }
      })
    }
  }
  findRandomMove(from: SpotState, ap: number): SpotState | null {
    if (ap < 1) {
      return null;
    }

    // const moveDistance = Math.floor((Math.random() * ap) + 1) - 1;

    const directionIndexes = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8]);

    const fromX = from.columnIndex;
    const fromY = from.rowIndex;

    const maxX = this._boardState.columnCount - 1;
    const maxY = this._boardState.rowCount - 1;

    for (let direction of directionIndexes) {
      const canMoveUp = fromY > 0;
      const canMoveRight = fromX < maxX;
      const canMoveDown = fromY < maxY;
      const canMoveLeft = fromX > 0;
      //clockwise starting at up

      //up
      if (direction === 1) {
        if (canMoveUp) {
          const to = this.getSpotByRC(fromX, fromY - 1);
          if (to.canAddPlayer()) {
            return to;
          }
        }
        return null;
      }

      //upright
      if (direction === 2) {
        if (canMoveUp && canMoveRight) {
          const to = this.getSpotByRC(fromX + 1, fromY - 1);
          if (to.canAddPlayer()) {
            return to;
          }
        }
        return null;
      }

      //right
      if (direction === 3) {
        if (canMoveRight) {
          const to = this.getSpotByRC(fromX + 1, fromY);
          if (to.canAddPlayer()) {
            return to;
          }
        }
        return null;
      }

      //downright
      if (direction === 4) {
        if (canMoveDown && canMoveRight) {
          const to = this.getSpotByRC(fromX + 1, fromY + 1);
          if (to.canAddPlayer()) {
            return to;
          }
        }
        return null;
      }

      //down
      if (direction === 5) {
        if (canMoveDown) {
          const to = this.getSpotByRC(fromX, fromY + 1);
          if (to.canAddPlayer()) {
            return to;
          }
        }
        return null;
      }

      //downleft
      if (direction === 6) {
        if (canMoveDown && canMoveLeft) {
          const to = this.getSpotByRC(fromX - 1, fromY + 1);
          if (to.canAddPlayer()) {
            return to;
          }
        }
        return null;
      }

      //left
      if (direction === 7) {
        if (canMoveLeft) {
          const to = this.getSpotByRC(fromX - 1, fromY);
          if (to.canAddPlayer()) {
            return to;
          }
        }
        return null;
      }

      //upleft
      if (direction !== 8 ||
        !canMoveLeft || !canMoveUp) {
        console.warn(`got into a bad spot finding random direction:${direction} fromX:${fromX} fromY:${fromY}`);
        return null;
      }

      const to = this.getSpotByRC(fromX - 1, fromY);
      if (to.canAddPlayer()) {
        return to;
      }
    }
    return null;
  }
  getSpotByRC(columnIndex: number, rowIndex: number): SpotState {
    return this.boardState.spots[(rowIndex * this.boardState.columnCount) + columnIndex];
  }

  private shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  private createPlayer(isUser: boolean = false): PlayerState {
    const playerId = this.makeid(12);

    const randApMax = 3;
    const ap = Math.floor(Math.random() * randApMax) + Math.floor(Math.random() * 2);

    const hp = 1 + Math.floor(Math.random() * 2);

    const player = new PlayerState(playerId, ap, hp, isUser);
    return player;
  }

  private makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

}
