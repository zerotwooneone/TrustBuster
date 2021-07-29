import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @HostBinding('style.grid-template-rows') rows: string = '';
  @HostBinding('style.grid-template-columns') columns: string = '';
  @HostBinding('style.--grid-column-width') columnWidth: string = '';

  public spots: any[] = [];

  constructor() {

  }

  ngOnInit(): void {
    const columnCount = 3;
    this.columns = `repeat(${columnCount}, var(--grid-column-width, 0))`;

    const rowCount = columnCount;
    this.rows = `repeat(${rowCount}, var(--grid-row-height, 0))`;

    this.spots = Array.from(Array(rowCount * columnCount).keys());
  }

}
