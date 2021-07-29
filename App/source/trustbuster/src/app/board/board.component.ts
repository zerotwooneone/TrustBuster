import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { BoardState } from './board-state';

@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @HostBinding('style.grid-template-rows') rows: string = '';
  @HostBinding('style.grid-template-columns') columns: string = '';
  @HostBinding('style.--grid-column-width') columnWidth: string = '';

  @Input() state: BoardState = null as any;

  public spots: any[] = [];

  constructor() {

  }

  ngOnInit(): void {
    this.columns = `repeat(${this.state.columnCount}, var(--grid-column-width, 0))`;

    this.rows = `repeat(${this.state.rowCount}, var(--grid-row-height, 0))`;

    this.spots = Array.from(Array(this.state.rowCount * this.state.columnCount).keys());
  }

}
