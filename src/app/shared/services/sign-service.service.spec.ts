import { TestBed } from '@angular/core/testing';
import { SignService } from './sign-service.service';

describe('SignServiceService', () => {
  let service: SignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
