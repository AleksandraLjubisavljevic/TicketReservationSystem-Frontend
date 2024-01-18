import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { Promocode } from '../model/Promocode';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class PromocodeService {

  private apiUrl:string;
  constructor(
    private http:HttpClient,
    private configService: ConfigService,
    private alertifyService: AlertifyService)
    {
      this.apiUrl = this.configService.apiUrl;
    }

  getPromocodeByCode(code: string):Observable<Promocode> {
    return this.http.get<Promocode>(this.apiUrl+`/Promocode/ByCode/${code}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('http error:', error);
        this.alertifyService.error('Došlo je do greške prilikom učitavanja promokoda');
        return throwError(() => error);
      })
    );
  }
}
