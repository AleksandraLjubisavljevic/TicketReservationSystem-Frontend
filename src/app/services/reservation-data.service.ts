import { Injectable } from '@angular/core';
import { CreateReservationRequest } from '../request/CreateReservationRequest';

@Injectable({
  providedIn: 'root'
})
export class ReservationDataService {
  private reservationData: CreateReservationRequest = {
    ConcertId: 0,
    ReservationDate: new Date(),
    Tickets: [],
    UsedPromocodeId: 0,
    Customer: null,
    TotalPrice:0
  };
  constructor() {}

  setReservationData(data: CreateReservationRequest) {
    this.reservationData = data;
  }

  getReservationData(): CreateReservationRequest {
    return this.reservationData;
  }
}
