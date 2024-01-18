import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ReservationTicket } from '../model/ReservationTicket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationTicketService {

  private apiUrl:string;
  constructor(private http:HttpClient,
    private configService: ConfigService) {
      this.apiUrl = this.configService.apiUrl;
  }
  getTickets():Observable<ReservationTicket[]>{
    return this.http.get<ReservationTicket[]>(this.apiUrl+'/ReservationTicket');
  }

}
