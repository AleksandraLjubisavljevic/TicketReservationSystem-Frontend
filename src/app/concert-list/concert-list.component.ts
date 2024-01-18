import { Component } from '@angular/core';
import { ConcertService } from '../services/concert.service';
import { NavigationExtras, Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-concert-list',
  templateUrl: './concert-list.component.html',
  styleUrls: ['./concert-list.component.css']
})
export class ConcertListComponent {
  concerts:any;
  SearchConcert = '';
  SortbyParam = '';
  SortDirection = 'asc';
  Concert='';

  constructor(private concertService:ConcertService,
    private router:Router,
    private alertify:AlertifyService){}

  ngOnInit(): void {
    this.concertService.getConcerts().subscribe({
      next: (data)=>{
        this.concerts=data;
        console.log(data);
      },
      error:(e)=>{
        console.log('httperror:');
        console.log(e);
      }
    }
    );
  }


  onConcertFilter() {
    this.SearchConcert = this.Concert;
  }

  onConcertFilterClear() {
    this.SearchConcert = '';
    this.Concert = '';
  }

  onSortDirection() {
    if (this.SortDirection === 'desc') {
        this.SortDirection = 'asc';
    } else {
        this.SortDirection = 'desc';
    }
  }

}
