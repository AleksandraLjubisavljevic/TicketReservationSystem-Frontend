import { Reservation } from "./Reservation";
import { ReservationTicket } from "./ReservationTicket";
import { Zone } from "./Zone";

export interface ReservationTicketResponse {
  reservation: Reservation,
  tickets: ReservationTicket[]
}
