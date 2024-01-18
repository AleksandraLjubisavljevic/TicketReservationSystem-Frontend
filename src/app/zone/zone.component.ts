import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Zone } from '../model/Zone';
import { ZoneService } from '../services/zone.service';
import { ReservationTicket } from '../model/ReservationTicket';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { ReservationDataService } from '../services/reservation-data.service';
import { CreateReservationRequest } from '../request/CreateReservationRequest';
import { SeatAvailableService } from '../services/avaialbleseats.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
  zoneForm: FormGroup;
  zones: Zone[];
  selectedZone: Zone;
  selectedZoneName: string = '';
  pricePerCard: number = 0;
  numberOfCards: number = 0;
  totalAmount: number = 0;
  currentDate: Date;
  tickets:ReservationTicket[];
  totalQuantity:number=0;
  reservationData: CreateReservationRequest;
  constructor(
    private formBuilder: FormBuilder,
    private zoneService: ZoneService,
    private alertify: AlertifyService,
    private router:Router,
    private sharedService:SharedService,
    private reservationDataService:ReservationDataService,
    private seatAvailableService:SeatAvailableService
  ) {}

  ngOnInit() {
    this.reservationData=this.reservationDataService.getReservationData();
    this.createZoneForm();
    this.getZones();
    this.tickets = [];
    this.currentDate = new Date();
  }

  createZoneForm() {
    this.zoneForm = this.formBuilder.group({
      zoneId: ['', Validators.required],
      numberOfCards: ['', [Validators.required, Validators.min(1)]]
    });
  }

  getZones() {
    this.zoneService.getZones().subscribe({
      next: (data) => {
      this.zones = data;
      console.log(data);
      },error: (e)=>{
        console.log('httperror:');
        console.log(e);
      }
    });
  }

  onZoneSelected() {
    const selectedZoneId = this.zoneForm.value.zoneId;
    this.zoneService.getZone(selectedZoneId).subscribe({
      next: (data) => {
      this.selectedZone = data;
      console.log("Zona: ",data);
      },error: (e)=>{
        console.log('httperror:');
        console.log(e);
      }
    });
    this.selectedZoneName = this.selectedZone ? this.selectedZone.name : '';
    this.pricePerCard = this.selectedZone ? this.selectedZone.price : 0;
    console.log("Pocetni totalAmount: ", this.totalAmount);
    this.updateTotalAmount();
    console.log("Nakon izabrane zone: ", this.totalAmount);
  }
  async addTickets() {
    const existingTicketIndex = this.tickets.findIndex(ticket => ticket.ZoneId === this.selectedZone.zoneId);
    if (existingTicketIndex !== -1) {
      this.tickets[existingTicketIndex].Quantity += this.numberOfCards;
    } else {
    if (this.zoneForm.valid) {
      console.log(this.selectedZone);
      console.log(this.numberOfCards);
      const newTicket: ReservationTicket = {
        ReservationTicketId: 0,
        ZoneId: this.selectedZone.zoneId,
        ZoneData:this.selectedZone,
        Quantity: this.numberOfCards,
        ReservationId:0,
        Reservation:null
      };
      try {
        const isAvailable = await this.seatAvailableService.checkSeatAvailability(this.selectedZone.zoneId, this.numberOfCards, this.reservationData.ConcertId).toPromise();

        if (isAvailable) {
          console.log("Nova karta: ", newTicket);
          this.tickets.push(newTicket);
          this.alertify.success('Uspešno dodavanje karata');
          console.log(newTicket);
          console.log(this.tickets);
          this.selectedZoneName = '';
          this.pricePerCard = 0;
          this.updateTotalAmount();
        } else {
            this.alertify.error('Nema dovoljno mesta za izabranu zonu.');
        }

    } catch (error) {
        console.error('Greška prilikom učitavanja slobodnih mesta:', error);
    }
  }
}
}
updateTotalAmount() {
  this.numberOfCards = this.zoneForm.controls['numberOfCards'].value;
  this.totalAmount = this.tickets.reduce((total, ticket) => total + this.calculateTicketTotal(ticket), 0);
}
  deleteTicket(index: number) {
    const deletedTicket = this.tickets[index];
    this.totalAmount -= this.calculateTicketTotal(deletedTicket);
    this.reservationData.TotalPrice=this.totalAmount;
    console.log("Nakon brisanja karte: ", this.reservationData.TotalPrice);
    this.tickets.splice(index, 1);
  }
  calculateTicketTotal(ticket: ReservationTicket): number {
    const discountDate = new Date('2023-11-01T00:00:00');
    const discountFactor = Math.floor(ticket.Quantity / 5);
    const discount = discountFactor * (ticket.ZoneData.price / 2);

    let ticketTotal = ticket.ZoneData.price * ticket.Quantity - discount;

    if (this.currentDate < discountDate) {
      console.log("Popust za early bird");
      ticketTotal *= 0.9;
    }

    return ticketTotal;
  }
  calculateTotal() {
    this.totalAmount = 0;
    const discountDate = new Date('2023-11-01T00:00:00');
    console.log("Ovde tickets: ", this.tickets);
    this.tickets.forEach(ticket => {
      const discountFactor = Math.floor(ticket.Quantity / 5);
      const discount = discountFactor * (ticket.ZoneData.price / 2);

      let ticketTotal = ticket.ZoneData.price * ticket.Quantity - discount;
      if (this.currentDate< discountDate) {
        console.log("Popust za early bird");
        ticketTotal *= 0.9;
      }
      this.totalAmount += ticketTotal;
      this.sharedService.setTotalAmount(this.totalAmount);
      console.log(this.sharedService.getTotalAmount());
      this.reservationData.ReservationDate=this.currentDate;
      this.reservationData.Tickets=this.tickets;
      this.reservationData.TotalPrice=this.totalAmount;
      this.reservationDataService.setReservationData(this.reservationData);
      console.log("Izmenjen: ",this.reservationData);
    });
  }
  async handleAddAndCalculate() {
    await this.addTickets();
    this.calculateTotal();
  }
  onBack(){
    this.router.navigate(['/concerts']);
  }

}
