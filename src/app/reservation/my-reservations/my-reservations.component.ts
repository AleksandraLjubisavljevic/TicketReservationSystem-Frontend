import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Reservation } from 'src/app/model/Reservation';
import { ReservationTicket } from 'src/app/model/ReservationTicket';
import { Zone } from 'src/app/model/Zone';
import { ReservationService } from 'src/app/services/reservation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteReservationComponent } from 'src/app/reservation/delete-reservation/delete-reservation.component';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent {
  message: string = '';
  token: string = '';
  email: string = '';
  show: boolean = false;
  myReservationForm:FormGroup;
  reservationData: Reservation;
  reservation:Reservation;
  tickets: ReservationTicket[];
  zone:Zone;
  constructor(
    public dialog: MatDialog,
    private fb:FormBuilder,
    private reservationService:ReservationService,
    private alertifyService: AlertifyService,
    private router: Router){}
  ngOnInit(){
    this.createReservationForm();

  }
  createReservationForm(){
    this.myReservationForm=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]]
    });
  }
  onSubmit(): void {
    if (this.myReservationForm.invalid) {
      return;
    }

    const email = this.myReservationForm.value.email;
    const token = this.myReservationForm.value.token;
    if(this.myReservationForm.valid){
      console.log("Check");
      this.reservationService.getReservationByEmailAndToken(token, email)
  .subscribe({
    next:(data) => {
    console.log(data);
    this.reservationData = data;

    if (this.reservationData != null) {
      this.reservation = this.reservationData;
      this.tickets = this.reservationData.Tickets;
      this.show = true;
      console.log(this.reservation);
      console.log(this.tickets);
    } else {
      this.message = 'No response';
      this.show = false;
    }
  },
  error:(e) => {
    console.log('Error', e);
    this.message = 'No response';
    this.show = false;
    this.alertifyService.error('Sistem ne može da pronađe rezervaciju po zadatim vrednostima');
  }});

  }

  }
  OpenDialog(rezervacijaId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;
    console.log("Token: ", this.token);
    console.log("Reservation data token: ",  this.myReservationForm.value.token);
    let dialogRef = this.dialog.open(DeleteReservationComponent, {
      height: '27%',
      width: '30%',
      data: {
        idRezervacija: rezervacijaId,
        token: this.myReservationForm.value.token
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('zatvoren dijalog');
    });
  }

  OpenPageForAlterReservation() {
    console.log(`izmeni rezervaciju ${this.reservation.ReservationId}`);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        reservation: JSON.stringify(this.reservation),
        token: this.reservation.Token,
        tickets: JSON.stringify(this.reservation.Tickets)
      },
    };
    console.log(this.reservation);
    console.log(this.reservation.Tickets);
    this.router.navigate(['update-reservation'], navigationExtras);
  }
}
