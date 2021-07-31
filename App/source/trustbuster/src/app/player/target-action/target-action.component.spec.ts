import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetActionComponent } from './target-action.component';

describe('TargetActionComponent', () => {
  let component: TargetActionComponent;
  let fixture: ComponentFixture<TargetActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
