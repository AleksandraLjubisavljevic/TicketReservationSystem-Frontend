import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-confirmation',
  templateUrl: './reservation-confirmation.component.html',
  styleUrls: ['./reservation-confirmation.component.css']
})
export class ReservationConfirmationComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ReservationConfirmationComponent>,
    private router: Router
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  redirectToMyReservation(): void {
    this.dialogRef.close();
    this.router.navigate(['/my-reservation']);
  }
}



