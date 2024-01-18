import { Component,Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PromptData } from 'src/app/model/PromptData';
import { AlertifyService } from 'src/app/services/alertify.service';
import { PromocodeService } from 'src/app/services/promocode.service';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-delete-reservation',
  templateUrl: './delete-reservation.component.html',
  styleUrls: ['./delete-reservation.component.css']
})
export class DeleteReservationComponent {
  constructor(
    private promocodeService:PromocodeService,
    private reservationService:ReservationService,
    private router: Router,
    private alertifyService:AlertifyService,
    @Inject(MAT_DIALOG_DATA) public data: PromptData){

  }
  DeleteReservation(reservationId: number, token: string) {
    console.log('Brisanje rezervacije...');
    this.reservationService
      .deleteReservation(reservationId, token)
      .subscribe( {
        next:()=>{
        this.alertifyService.success("Uspešno ste otkazali rezervaciju");
        window.location.reload();
      },error: (e)=>{
        this.alertifyService.error("Greška prilikom otkazivanja rezervacije");
        console.log('httperror:');
        console.log(e);
      }
    }
      );

  }
  onBack(){
    this.router.navigate(['/my-reservation']);
  }
}
