import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators,  AbstractControl } from '@angular/forms';
import {CustomerService } from '../services/customer.service';
import { Customer } from '../model/Customer';
import { AlertifyService } from '../services/alertify.service';
import { ReservationDataService } from '../services/reservation-data.service';
import { CreateReservationRequest } from '../request/CreateReservationRequest';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit{

  nextClicked: boolean;
  userForm:FormGroup;
  customer:Customer;
  usersubmitted:boolean;
  cityList: any[];
  reservationData:CreateReservationRequest;
  constructor(private router:Router,
              private fb:FormBuilder,
              private alertify:AlertifyService,
              private reservationDataService:ReservationDataService
              ){

              }
  ngOnInit() {

    this.createUserForm();
  }
  emailMatchingValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const email = control.get('email');
    const confirmEmail = control.get('confirmEmail');

    if (!email || !confirmEmail) {
      return null;
    }

    return email.value === confirmEmail.value ? null : { notmatched: true };
  }
  createUserForm(){
    this.userForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        company: [''],
        address1: ['', Validators.required],
        address2: [''],
        postalCode: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required]],
      },
      { validators: this.emailMatchingValidator }
    );
    }


  onBack(){
    this.router.navigate(['/']);
  }
  onSubmit(){
    this.reservationData=this.reservationDataService.getReservationData();
    const email = this.userForm.value.email;
    console.log("Submitted");
    console.log(this.reservationData);
    this.reservationData.Customer=this.customerData();
    console.log(this.reservationData);
    this.usersubmitted=true;
    if(this.userForm.valid){
      this.reservationDataService.setReservationData(this.reservationData);
      this.alertify.success("Uneli ste validne podatke");
    }
    else{
    this.alertify.error("Nevalidni podaci");
    }


      console.log(this.reservationData);
    }



  customerData(): Customer{
    return this.customer = {
      FirstName: this.firstName.value,
      LastName:this.lastName.value,
      Company:this.company.value,
      Address1:this.address1.value,
      Address2:this.address2.value,
      PostalCode:this.postalCode.value,
      City:this.city.value,
      Country:this.country.value,
      Email:this.email.value,
      EmailConfirmation:this.confirmEmail.value
    };
  }

  get firstName() {
    return this.userForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.userForm.get('lastName') as FormControl;
  }
  get company() {
    return this.userForm.get('company') as FormControl;
  }
  get address1() {
    return this.userForm.get('address1') as FormControl;
  }
  get address2() {
    return this.userForm.get('address2') as FormControl;
  }
  get postalCode() {
    return this.userForm.get('postalCode') as FormControl;
  }
  get city() {
    return this.userForm.get('city') as FormControl;
  }
  get country() {
    return this.userForm.get('country') as FormControl;
  }
  get email() {
    return this.userForm.get('email') as FormControl;
  }
  get confirmEmail() {
    return this.userForm.get('confirmEmail') as FormControl;
  }
  onCancel(){
    this.userForm.reset();
  }
}
