import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class SeatAvailableService {
  private apiUrl:string;
  constructor(private http:HttpClient,
    private configService: ConfigService,
    private alertifyService:AlertifyService)
    {
      this.apiUrl = this.configService.apiUrl;
    }

  checkSeatAvailability(zoneId: number, numberOfCards: number, concertId:number): Observable<boolean> {
    const params = {
      zoneId: zoneId.toString(),
      numberOfCards: numberOfCards.toString(),
      concertId:concertId.toString()
    };

    return this.http.get<boolean>(this.apiUrl+`/AvailableSeats/check-availability`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertifyService.error('Došlo je do greške prilikom provere slobodnih mesta');
        return throwError(() => error);
      })
    );
  }
}
