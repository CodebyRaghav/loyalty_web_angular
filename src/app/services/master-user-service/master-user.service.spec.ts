import { TestBed } from '@angular/core/testing';

import { MasterUserService } from './master-user.service';

describe('MasterUserService', () => {
  let service: MasterUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
