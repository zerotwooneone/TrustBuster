import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSpotComponent } from './board-spot.component';

describe('BoardSpotComponent', () => {
  let component: BoardSpotComponent;
  let fixture: ComponentFixture<BoardSpotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardSpotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
