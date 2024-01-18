import { Concert } from "./Concert";
import { Customer } from "./Customer";
import { Promocode } from "./Promocode";
import { ReservationTicket } from "./ReservationTicket";

export interface Reservation{
  /*reservationId: number;
  date:Date;
  customer: Customer;
  concert:Concert,
  promocode: Promocode;
  tickets: ReservationTicket[];*/
  ReservationId:number;
  ReservationDate:Date;
  IsCancelled:boolean;
  TotalPrice:number;
  Token:string;
  CustomerId:number;
  ConcertId:number;
  PromocodeId:number;
  Customer: Customer;
  Concert: Concert;
  Code:string;
  Promocode:Promocode;
  UsedPromocodeId:number;
  UsedPromocode:Promocode;
  Tickets:ReservationTicket[];
}
