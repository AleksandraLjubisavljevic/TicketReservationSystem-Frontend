import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Concert } from '../model/Concert';
import { ConfigService } from './config.service';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  private apiUrl:string;
  constructor(private http:HttpClient,
    private configService: ConfigService,
    private alertify:AlertifyService) {
      this.apiUrl = this.configService.apiUrl;
    }

  getConcert(concertId: number): Observable<Concert> {
    return this.http.get<Concert>(this.apiUrl + `/Concert/${concertId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertify.error('Došlo je do greške prilikom učitavanja koncerta');
        return throwError(() => error);
      })
    );
  }


  getConcerts(): Observable<Concert[]> {
    return this.http.get<Concert[]>(this.apiUrl + '/Concert').pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertify.error('Došlo je do greške prilikom učitavanja koncerata');
        return throwError(() => error);
      })
    );
  }
}

