import { Customer } from "../model/Customer";
import { Promocode } from "../model/Promocode";
import { ReservationTicket } from "../model/ReservationTicket";

export interface CreateReservationRequest{
  ConcertId:number;
  ReservationDate:Date;
  Tickets:ReservationTicket[];
  UsedPromocodeId:number;
  Customer:Customer;
  TotalPrice:number;
}
