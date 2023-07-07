import { TestBed } from '@angular/core/testing';

import { IsLogedGuardGuard } from './is-loged-guard.guard';

describe('IsLogedGuardGuard', () => {
  let guard: IsLogedGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsLogedGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
