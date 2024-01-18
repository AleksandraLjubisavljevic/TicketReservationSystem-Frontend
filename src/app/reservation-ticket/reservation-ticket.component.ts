import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationRequest } from '../request/CreateReservationRequest';
import { Concert } from '../model/Concert';
import { Subscription } from 'rxjs';
import { ReservationDataService } from '../services/reservation-data.service';
import { ConcertService } from '../services/concert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { AlertifyService } from '../services/alertify.service';
import { CreateReservationResponse } from '../response/CreateReservationResponse';
import { MatDialog } from '@angular/material/dialog';
import { ReservationConfirmationComponent } from '../reservation/reservation-confirmation/reservation-confirmation.component';

@Component({
  selector: 'app-reservation-ticket',
  templateUrl: './reservation-ticket.component.html',
  styleUrls: ['./reservation-ticket.component.css']
})
export class ReservationTicketComponent implements OnInit{
  stepperForm: FormGroup;
  createReservationRequest: CreateReservationRequest;
  concert: Concert;
  concertId: number = -1;
  sub: Subscription;
  reservationData:CreateReservationRequest;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private concertService:ConcertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reservationDataService:ReservationDataService,
    private alertify:AlertifyService,
    private dialog: MatDialog
  ) {
    this.stepperForm = this.formBuilder.group({
      numberOfCards: [0],
      promoCode:null
    });
  }
  ngOnInit(): void {
    this.sub = this.activatedRoute.queryParams.subscribe(params => {
      this.concertId = +params['id'];
      console.log(this.concertId);
      this.concertService.getConcert(this.concertId).subscribe({
        next: (data) => {
        this.concert = data;
        console.log(data);
      },error:(error) =>{
        console.log('httperror:');
        console.log(error);
      }
    });
      const reservationData: CreateReservationRequest = {
        ConcertId: this.concertId,
        ReservationDate:new Date(),
        Tickets: [],
        UsedPromocodeId: -1,
        Customer: null,
        TotalPrice:0
      };
      this.reservationDataService.setReservationData(reservationData);

    });
  }
  onSubmit(){
    this.reservationData=this.reservationDataService.getReservationData();
    console.log("Podaci o rezervaciji: ", this.reservationData);
    if(this.reservationData.Customer!=null){
    this.reservationService.addReservation(this.reservationData).subscribe({
      next:(response: CreateReservationResponse) => {
        const dialogRef = this.dialog.open(ReservationConfirmationComponent, {
          width: '600px',
          data: {
            message: response.message,
            token: response.token,
            promoCode: response.promoCode
          }
        });
        console.log("Response od API-ja:", response.message);
        console.log("Kreirani token: ", response.token);
        console.log("Generisani promokod: ", response.promoCode);
        this.router.navigate(['/my-reservation']);
      },error:
      (error) => {
        console.error("Greska od API-ja:", error);
        this.alertify.error("Došlo je do greške prilikom rezervacije");
      }}
    )}else{

      console.error("Customer nije definisan");
      this.alertify.error("Unesite i potvrdite podatke za kupca");
    };
  }
  onBack(){
    this.router.navigate(['/concerts']);
  }
  getConcertNamePart1(fullName: string): string {
    const parts = fullName.split('-');
    return parts[0].trim();
  }

  getConcertNamePart2(fullName: string): string {
    const parts = fullName.split('-');
    return parts[1].trim();
  }
}

