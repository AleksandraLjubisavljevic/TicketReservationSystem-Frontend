import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Customer } from '../model/Customer';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl:string;
  constructor(
    private http:HttpClient,
    private configService: ConfigService) {
      this.apiUrl = this.configService.apiUrl;
    }
  getCustomers():Observable<Customer[]>{
    return this.http.get<Customer[]>(this.apiUrl+'/Customer');
  }
  /*addCustomer(customer: Customer): Observable<any> {
    return this.http.post<Customer>(this.apiUrl+'/Customer', customer)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  /*getCustomerByEmail(email:string):Observable<Customer>{
    return this.http.get<Customer>(this.apiUrl+`/Customer/ByEmail/${email}`)
  }

  deleteCustomer(customerId: number): Observable<unknown> {
  const url = this.apiUrl+`'/Customer'/${customerId}`;
  return this.http.delete(url)
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
}*/
  /*private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('A client-side or network error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }*/
}
