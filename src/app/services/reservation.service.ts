import { Reservation } from '../model/Reservation';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { CreateReservationRequest } from '../request/CreateReservationRequest';
import { CreateReservationResponse } from '../response/CreateReservationResponse';
import { UpdateReservationRequest } from '../request/UpdateReservationRequest';
import { Zone } from '../model/Zone';
import { AlertifyService } from './alertify.service';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl:string;
  constructor(private http:HttpClient,
    private configService: ConfigService,
    private alertifyService:AlertifyService) {
      this.apiUrl = this.configService.apiUrl;
    }

  addReservation(createReservation: CreateReservationRequest): Observable<any> {
    return this.http.post<CreateReservationResponse>(this.apiUrl+'/Reservation', createReservation)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertifyService.error('Došlo je do greške prilikom učitavanja koncerata');
        return throwError(() => error);
      })
    );

  }

  updateReservation(updateReservationData:UpdateReservationRequest, token:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    const requestOptions = { headers: headers };
    return this.http.put(this.apiUrl+
      '/Reservation',
      updateReservationData,
      requestOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertifyService.error('Došlo je do greške prilikom učitavanja koncerata');
        return throwError(() => error);
      })
    );
  }

deleteReservation(reservationId: number, token: string): Observable<any> {
  const url = `${this.apiUrl}/Reservation/${reservationId}`;

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });

  const requestOptions = { headers: headers };

  return this.http.delete(url, requestOptions).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('http error:', error);
      this.alertifyService.error('Došlo je do greške prilikom učitavanja koncerata');
      return throwError(() => error);
    })
  );
}


getReservationByEmailAndToken(token: string, email: string): Observable<Reservation> {
  const params = new HttpParams()
    .set('token', token)
    .set('email', email);
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
  });
  return this.http.get<Reservation>(this.apiUrl + '/Reservation/reservations', { params,headers })
    .pipe(
      map(response => {
        if (response.Tickets && Array.isArray(response.Tickets["$values"])) {
          console.log("Is array: ", Array.isArray(response.Tickets))
          console.log("response.Tickets before array: ",response.Tickets);
          response.Tickets = response.Tickets["$values"];

          console.log("response.Tickets after array: ",response.Tickets);
        }
        response.Tickets = response.Tickets.map(ticket => ({
          ...ticket,
          ZoneData: ticket.ZoneData as Zone
        }));
        console.log("tickets: ", response.Tickets);
        return response;
      })
    );
}
}

