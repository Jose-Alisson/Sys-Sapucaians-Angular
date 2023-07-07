import { TestBed } from '@angular/core/testing';

import { LoadAdmGuard } from './load-adm.guard';

describe('LoadAdmGuard', () => {
  let guard: LoadAdmGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoadAdmGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
