import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Zone } from '../model/Zone';
import { ConfigService } from './config.service';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private apiUrl:string;
  private apiKey:string;
  constructor(private http:HttpClient,
    private configService: ConfigService,
    private alertifyService: AlertifyService) {
      this.apiUrl = this.configService.apiUrl;
    }
  getZones():Observable<Zone[]>{
    return this.http.get<Zone[]>(this.apiUrl+'/Zone').pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertifyService.error('Došlo je do greške prilikom učitavanja zona');
        return throwError(() => error);
      })
    );
  }
  getZone(zoneId:number):Observable<Zone>{
    return this.http.get<Zone>(this.apiUrl+`/Zone/${zoneId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertifyService.error('Došlo je do greške prilikom učitavanja zone');
        return throwError(() => error);
      })
    );
  }

}
