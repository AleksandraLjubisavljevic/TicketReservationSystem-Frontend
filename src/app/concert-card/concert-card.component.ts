import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-concert-card',
  templateUrl: './concert-card.component.html',
  styleUrls: ['./concert-card.component.css']
})
export class ConcertCardComponent {
  @Input() concert: any;
  constructor(private router : Router){}
  openPageForReservation(id: number) {
    console.log(id);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id
      },
    };
    console.log(id);
    this.router.navigate(['reservation'], navigationExtras);
  }
  getConcertImagePath(concertId: number): string {
    const concertImageMapping = {
      1: './assets/koncert1.jpg',
      2: './assets/koncert2.jpg',
      3: './assets/koncert3.webp',
      4: './assets/koncert4.jpg',
      5: './assets/koncert5.jpg',
      6: './assets/koncert6.jpg'
    };

    return concertImageMapping[concertId] || '';
  }
}
