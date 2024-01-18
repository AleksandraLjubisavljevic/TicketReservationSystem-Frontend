import { Reservation } from "./Reservation";
import { Zone } from "./Zone";

export class ReservationTicket {
  constructor(
    public ReservationTicketId: number,
    public ZoneId: number,
    public ZoneData:Zone,
    public Quantity: number,
    public ReservationId:number,
    public Reservation:Reservation
  ) {}
}

