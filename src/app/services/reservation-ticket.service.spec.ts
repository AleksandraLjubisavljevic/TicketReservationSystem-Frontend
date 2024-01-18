import { TestBed } from '@angular/core/testing';

import { ReservationTicketService } from './reservation-ticket.service';

describe('ReservationTicketService', () => {
  let service: ReservationTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
