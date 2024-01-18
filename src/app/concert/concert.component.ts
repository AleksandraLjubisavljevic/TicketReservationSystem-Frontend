import { Component, Input, OnInit } from '@angular/core';
import { ConcertService } from '../services/concert.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-concert',
  templateUrl: './concert.component.html',
  styleUrls: ['./concert.component.css']
})
export class ConcertComponent implements OnInit{
  concert: any;
  public concertId: number;
  constructor(private route: ActivatedRoute,
              private concertService:ConcertService,
              private router:Router){}
  ngOnInit(): void {
    this.concertId = this.route.snapshot.params['id'];
    this.concertService.getConcert(this.concertId).subscribe({
    next: (data) => {
    this.concert = data;
    console.log("Zona: ",data);
    },error: (e)=>{
      console.log('httperror:');
      console.log(e);
    }
  });
  }
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
  getConcertNamePart1(fullName: string): string {
    if(fullName!=null){
      const parts = fullName.split('-');
      return parts[0].trim();
    }
    else{
      return fullName;
    }
  }

  getConcertNamePart2(fullName: string): string {
    if(fullName!=null){
      const parts = fullName.split('-');
      return parts[1].trim();
    }else{
      return fullName;
    }
  }
}


