import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocodeService } from '../services/promocode.service';
import { Promocode } from '../model/Promocode';
import { SharedService } from '../services/shared.service';
import { ReservationDataService } from '../services/reservation-data.service';
import { CreateReservationRequest } from '../request/CreateReservationRequest';
import { AlertifyService } from '../services/alertify.service';


@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.css']
})
export class PromocodeComponent implements OnInit{
  totalAmount:number;
  promocodeForm:FormGroup;
  code:string;
  promocode:Promocode;
  isValidForUsing:boolean;
  reservationData:CreateReservationRequest;
  discountApplied: boolean = false;
  constructor(private router:Router,
             private formBuilder:FormBuilder,
             private promocodeService: PromocodeService,
             private sharedService: SharedService,
             private reservationDataService:ReservationDataService,
             private alertifyService:AlertifyService

    ){
    }
  ngOnInit(){
    this.promocode ={
      promocodeId :-1,
      code : '',
      isUsed : false
    };
    console.log(this.totalAmount);
    this.createPromocodeForm();
    //this.totalAmount=this.sharedService.getTotalAmount();
    console.log("Servis: ", this.reservationDataService.getReservationData().TotalPrice);
    console.log("Promokod ukupno: ", this.totalAmount);
  }
  createPromocodeForm(){
    this.promocodeForm=this.formBuilder.group({
      promocode:['']
    })
  }
  onBack(){
    this.router.navigate(['/']);
  }
  async onSubmit() {
    this.reservationData=this.reservationDataService.getReservationData();
    console.log(this.reservationData);
    this.totalAmount=this.reservationData.TotalPrice;
    this.code=this.promocodeForm.controls['promocode'].value;
    console.log("Code ", this.code);
    if (this.code !== null && this.code !== '') {
      this.promocodeService.getPromocodeByCode(this.code).subscribe({
        next: (data) => {
          this.promocode = data;
          this.reservationData.UsedPromocodeId = this.promocode.promocodeId;
          this.reservationDataService.setReservationData(this.reservationData);
          if(!this.discountApplied)
          {
            if (!this.promocode.isUsed) {
              this.alertifyService.success("Promokod je validan");
              this.calculateTotalAmountWithPromocode();
              this.discountApplied = true;
            } else {
              this.alertifyService.error("Promo code je vec iskoriscen.");
              this.totalAmount=this.sharedService.getTotalAmount();
            }
          }
        },
        error: (e) => {
          this.alertifyService.error('Greska prilikom provere promo koda.');
          console.log('httperror:');
          console.log(e);
        }
      });
    } else {
      this.alertifyService.warning('Kod nije unet');
    }
  }


  calculateTotalAmountWithPromocode(){
    if (this.promocode != null && this.code !== '') {
    if(!this.promocode.isUsed){
      this.totalAmount=this.totalAmount*0.95;
      this.sharedService.setTotalAmount(this.totalAmount);
      console.log(this.totalAmount);
      this.promocode.isUsed=true;
    }
    this.reservationData.TotalPrice=this.totalAmount;
    this.reservationDataService.setReservationData(this.reservationData);
    console.log(this.reservationData);
  }else {
    console.log('Kod nije unet');
  }
  }
}
