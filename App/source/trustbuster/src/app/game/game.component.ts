import { Component, OnInit } from '@angular/core';
import { BoardState } from '../board/board-state';

@Component({
  selector: 'tb-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public boardState: BoardState = null as any;

  constructor() { }

  ngOnInit(): void {
    //todo: get game state
    this.boardState = new BoardState();
  }

  onAddActionPoint() {
    this.boardState.onAddActionPoint();
  }

}
