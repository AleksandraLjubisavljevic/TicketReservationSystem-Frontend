import { Injectable } from '@angular/core';
import { CreateReservationRequest } from '../request/CreateReservationRequest';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private totalAmount: number;


  setTotalAmount(amount: number) {
    this.totalAmount = amount;
  }

  getTotalAmount() {
    return this.totalAmount;
  }
}
