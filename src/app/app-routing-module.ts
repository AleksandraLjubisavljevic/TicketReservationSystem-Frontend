import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConcertComponent } from './concert/concert.component';
import { ConcertListComponent } from './concert-list/concert-list.component';
import { MyReservationsComponent } from './reservation/my-reservations/my-reservations.component';
import { UpdateReservationComponent } from './reservation/update-reservation/update-reservation.component';
import { ReservationTicketComponent } from './reservation-ticket/reservation-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: ConcertListComponent
  },
  {
    path: 'concerts',
    component:ConcertListComponent
  },
  {
    path: 'reservation',
    component: ReservationTicketComponent
  },
  {
    path:'concert/:id',
    component:ConcertComponent
  },
  {
    path:'my-reservation',
    component:MyReservationsComponent
  },
  {
    path:'update-reservation',
    component:UpdateReservationComponent
  },
  {
    path: '**',
    component: ConcertListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
