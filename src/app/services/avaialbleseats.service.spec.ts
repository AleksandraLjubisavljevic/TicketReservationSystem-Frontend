import { TestBed } from '@angular/core/testing';

import { AvaialbleseatsService } from './avaialbleseats.service';

describe('AvaialbleseatsService', () => {
  let service: AvaialbleseatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvaialbleseatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
