import { CdkDragDrop, CdkDragEnter, CdkDragSortEvent } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { SpotState } from '../board-spot/spot-state';
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

  public spots: SpotState[] = [];

  constructor() {

  }

  ngOnInit(): void {
    this.columns = `repeat(${this.state.columnCount}, var(--grid-column-width, 0))`;

    this.rows = `repeat(${this.state.rowCount}, var(--grid-row-height, 0))`;

    this.spots = this.state.spots;
  }

  drop(event: CdkDragDrop<SpotState>) {
    console.log(event);
  }

  enter(event: CdkDragEnter<SpotState>) {
    console.log(`moving from:${event.item?.dropContainer?.data?.rowIndex},${event.item?.dropContainer?.data?.columnIndex} to:${event.container?.data?.rowIndex},${event.container?.data?.columnIndex}`);
    console.warn(event);
  }

}
