import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Reservation } from 'src/app/model/Reservation';
import { ReservationTicket } from 'src/app/model/ReservationTicket';
import { Zone } from 'src/app/model/Zone';
import { UpdateReservationRequest } from 'src/app/request/UpdateReservationRequest';
import { AlertifyService } from 'src/app/services/alertify.service';
import { SeatAvailableService } from 'src/app/services/avaialbleseats.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { SharedService } from 'src/app/services/shared.service';
import { ZoneService } from 'src/app/services/zone.service';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css']
})
export class UpdateReservationComponent implements OnInit{
  token: string;
  zoneForm: FormGroup;
  zones: Zone[];
  reservation: Reservation;
  sub: Subscription;
  tickets:ReservationTicket[];
  selectedZone: Zone;
  selectedZoneName: string = '';
  pricePerCard: number = 0;
  numberOfCards: number = 0;
  totalAmount: number = 0;
  updateReservationData:UpdateReservationRequest;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reservationService: ReservationService,
    private zoneService: ZoneService,
    private alertify: AlertifyService,
    private sharedService:SharedService,
    private seatAvailableService:SeatAvailableService
  ) {
    this.sub = this.activatedRoute.queryParams.subscribe((params) => {
      if (params['reservation'] == undefined) {
        this.router.navigate(['my-reservations']);
      }
      this.reservation = JSON.parse(params['reservation']);
      this.token = params['token'];
      this.tickets = JSON.parse(params['tickets']);
      console.log(Array.isArray(this.tickets));
      console.log("Tickets: ",this.tickets);
      console.log("Reservation: ", this.reservation);
    });


  }
  ngOnInit(): void {
    this.createZoneForm();
    this.getZones();
    this.updateReservationData = {
      ReservationId:0,
      Token: '',
      Email: '',
      Tickets: [],
      TotalPrice:0
    };
    this.totalAmount=this.reservation.TotalPrice;
  }
  createZoneForm() {
    this.zoneForm = this.formBuilder.group({
      zoneId: ['', Validators.required],
      numberOfCards: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });
  }

  getZones() {
    this.zoneService.getZones().subscribe({
      next: (data) => {
      this.zones = data;
    },error: (e)=>{
      console.log('httperror:');
      console.log(e);

    }});
  }

  async onZoneSelected() {
    const selectedZoneId = this.zoneForm.value.zoneId;

    try {
      const data = await this.zoneService.getZone(selectedZoneId).toPromise();
      this.selectedZone = data;
      console.log("Izabrana zona: ", this.selectedZone);

      this.selectedZoneName = this.selectedZone ? this.selectedZone.name : '';
      this.pricePerCard = this.selectedZone ? this.selectedZone.price : 0;
      console.log("Pocetni totalAmount: ", this.totalAmount);
      this.updateTotalAmount();
      console.log("Nakon izabrane zone: ", this.totalAmount);
    } catch (error) {
      console.error('Error fetching zone:', error);
    }
  }

  async addTickets() {
    const existingTicketIndex = this.tickets.findIndex(ticket => ticket.ZoneId === this.selectedZone.zoneId);
    if (existingTicketIndex !== -1) {
      console.log("Postoji zona");
      console.log("Broj karata: ",this.numberOfCards);
      console.log("Existing ticket index: ", existingTicketIndex);
      this.tickets[existingTicketIndex].Quantity += this.numberOfCards;
      console.log("Existing ticket index quantity: ", this.tickets[existingTicketIndex].Quantity);
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
        const isAvailable = await this.seatAvailableService.checkSeatAvailability(this.selectedZone.zoneId, this.numberOfCards, this.reservation.ConcertId).toPromise();

        if (isAvailable) {
          console.log("Nova karta: ", newTicket);
          this.tickets.push(newTicket);
          this.alertify.success('Uspešno dodavanje karata');
          console.log(newTicket);
          console.log(this.tickets);
          this.selectedZoneName = '';
          this.pricePerCard = 0;
          this.updateTotalAmount();
          console.log("Nakon addTickets: ", this.totalAmount);
        } else {
            this.alertify.error('Nema dovoljno mesta za izabranu zonu.');
        }

    } catch (error) {
        console.error('Error checking seat availability:', error);
    }
  }
    }
  }

  updateTotalAmount() {
    if (!this.zones || this.zones.length === 0) {
      console.log('Zones array is empty or not loaded yet.');
      return;
    }

    this.numberOfCards = +this.zoneForm.controls['numberOfCards'].value;
    this.pricePerCard = this.selectedZone ? this.selectedZone.price : 0;

    console.log('numberOfCards:', this.numberOfCards);
    console.log('pricePerCard:', this.pricePerCard);
    console.log('totalAmount1 ', this.totalAmount);
    this.totalAmount = this.tickets.reduce((total, ticket) => total + this.calculateTicketTotal(ticket), 0);

  }

  deleteTicket(index: number) {
    const deletedTicket = this.tickets[index];
    console.log("Pre brisanja karte: ", this.totalAmount);
    this.totalAmount -= this.calculateTicketTotal(deletedTicket);
    console.log("Deleted ticket: ", deletedTicket);
    console.log("This.calculateTicketTotal: ", this.calculateTicketTotal(deletedTicket));
    console.log("Nakon brisanja karte: ", this.totalAmount);
    this.tickets.splice(index, 1);
    this.calculateTotal();
  }
  calculateTicketTotal(ticket: ReservationTicket): number {
    const discountDate = new Date('2023-11-01T00:00:00');
    const discountFactor = Math.floor(ticket.Quantity / 5);
    const zonePrice = ticket.ZoneData['Price'] || ticket.ZoneData['price'];
    console.log("Zone price: ", zonePrice);
    const discount = discountFactor * (zonePrice / 2);
    console.log("Discount for ticket: ", discount);
    let ticketTotal = zonePrice * ticket.Quantity - discount;
    console.log("Ticket total: ", ticketTotal);
    const backendDate = new Date(this.reservation.ReservationDate);
    console.log("Datum: ",backendDate);
    console.log("Poredjenje: ",backendDate < discountDate);
    if (backendDate < discountDate) {
      console.log("Popust za early bird");
      ticketTotal *= 0.9; // Apply a 10% discount
    }

    return ticketTotal;
  }
  calculateTotal() {
    console.log("Pocetak calculateTotal")
    this.totalAmount = 0;
    const discountDate = new Date('2023-11-01T00:00:00');
    //this.totalQuantity=0;
    console.log("This.tickets: ", this.tickets);
    this.tickets.forEach(ticket => {
      const ticketTotal = this.calculateTicketTotal(ticket); // Calculate ticket total with discounts
      this.totalAmount += ticketTotal;
    });
   /* this.tickets.forEach(ticket => {
      console.log("ticket.Quantity: ", ticket.Quantity);
      console.log("ticket.Zone.price: ", ticket.ZoneData['Price'] || ticket.ZoneData['price']);
      const zoneId = ticket.ZoneData['ZoneId'] || ticket.ZoneData['zoneId'];
      const zonePrice = ticket.ZoneData['Price'] || ticket.ZoneData['price']
      const discountFactor = Math.floor(ticket.Quantity / 5);

      const discount = discountFactor * (zonePrice / 2);

      console.log("DiscountFactor: ", discountFactor);
      console.log("Discount: ", discount);
      let ticketTotal = zonePrice * ticket.Quantity - discount;
      //PROVERITI
      console.log("Datum1: ", this.reservation.ReservationDate);
      const backendDate = new Date(this.reservation.ReservationDate);
      console.log("Discount date: ", discountDate);
      console.log("Poredjenje: ",backendDate < discountDate);
      if (backendDate< discountDate) {
        console.log("Popust za early bird");
        ticketTotal *= 0.9; // Apply a 10% discount
      }
      console.log("Promokod: ", this.reservation.UsedPromocodeId);
      if(this.reservation.UsedPromocodeId!==-1){
        console.log("Popust za promokod");
        ticketTotal*=0.95;
      }
      console.log("Calculate total, ticket total: ", ticketTotal);
      this.totalAmount += ticketTotal;
      this.sharedService.setTotalAmount(this.totalAmount);
      console.log("This.totalAmount: ", this.totalAmount);
      console.log(this.sharedService.getTotalAmount());
      this.reservation.TotalPrice=this.totalAmount;
      console.log("Izmenjen: ",this.reservation.TotalPrice);*/
      if (this.reservation.UsedPromocodeId !== -1) {
        this.totalAmount *= 0.95; // Apply a 5% discount for promo code
      }

      this.sharedService.setTotalAmount(this.totalAmount);
    }

  async handleAddAndCalculate() {
    await this.addTickets();
    this.calculateTotal();
  }
  onBack(){
    this.router.navigate(['/my-reservation']);
  }
  updateReservation(){
    this.updateReservationData.ReservationId=this.reservation.ReservationId;
    this.updateReservationData.Email=this.reservation.Customer.Email;
    this.updateReservationData.Token=this.reservation.Token;
    this.updateReservationData.Tickets=this.tickets;
    this.updateReservationData.TotalPrice=this.totalAmount;
    console.log("Izmenjena rezervacija: ",this.updateReservation);

    this.reservationService.updateReservation(this.updateReservationData, this.reservation.Token).subscribe(
      {
        next:()=>{
        this.alertify.success("Uspešno ste izmenili rezervaciju");
      },error:
      (error: any) => {
        console.error("Error from API:", error);
        this.alertify.error("Došlo je do greške prilikom izmene rezervacije");
      }}
    );
  }

}
