import { TestBed } from '@angular/core/testing';

import { PlayerMoveService } from './player-move.service';

describe('PlayerMoveService', () => {
  let service: PlayerMoveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerMoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
