import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ConcertComponent } from './concert/concert.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing-module';
import { ZoneComponent } from './zone/zone.component';
import { CustomerComponent } from './customer/customer.component';
import { ReservationTicketComponent } from './reservation-ticket/reservation-ticket.component';
import { PromocodeComponent } from './promocode/promocode.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule , FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConcertService } from './services/concert.service';
import { ConcertListComponent } from './concert-list/concert-list.component';
import { CustomerService } from './services/customer.service';
import { AlertifyService } from './services/alertify.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs/tabset.component';
import { ReservationTicketService } from './services/reservation-ticket.service';
import { FooterComponent } from './footer/footer.component';
import { BsDropdownModule,BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { TitleComponent } from './title/title.component';
import { ConcertCardComponent } from './concert-card/concert-card.component';
import { UpdateReservationComponent } from './reservation/update-reservation/update-reservation.component';
import { MyReservationsComponent } from './reservation/my-reservations/my-reservations.component';
import { DeleteReservationComponent } from './reservation/delete-reservation/delete-reservation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { ReservationConfirmationComponent } from './reservation/reservation-confirmation/reservation-confirmation.component';
import { ConfigService } from './services/config.service';
import { SeatAvailableService } from './services/avaialbleseats.service';
import { ZoneService } from './services/zone.service';
import { ReservationService } from './services/reservation.service';
import { SharedService } from './services/shared.service';
import { ReservationDataService } from './services/reservation-data.service';
import { PromocodeService } from './services/promocode.service';

@NgModule({
  declarations: [
    AppComponent,
    ConcertComponent,
    NavbarComponent,
    ZoneComponent,
    CustomerComponent,
    ReservationTicketComponent,
    PromocodeComponent,
    ConcertListComponent,
    FooterComponent,
    TitleComponent,
    ConcertCardComponent,
    UpdateReservationComponent,
    MyReservationsComponent,
    DeleteReservationComponent,
    CustomDatePipe,
    FilterPipe,
    SortPipe,
    ReservationConfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatStepperModule,
    HttpClientModule,
    ReactiveFormsModule,
    BsDropdownModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [
    ConcertService,
    CustomerService,
    AlertifyService,
    ReservationTicketService,
    SeatAvailableService,
    ZoneService,
    ReservationService,
    SharedService,
    ReservationDataService,
    PromocodeService,
    ConfigService,
    BsDropdownConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
