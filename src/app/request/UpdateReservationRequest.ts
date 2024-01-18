import { ReservationTicket } from "../model/ReservationTicket";

export interface UpdateReservationRequest{
  ReservationId:number;
  Token:string;
  Email:string;
  Tickets:ReservationTicket[];
  TotalPrice:number;
}
