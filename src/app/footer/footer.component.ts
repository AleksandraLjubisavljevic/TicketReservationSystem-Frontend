import { Component } from '@angular/core';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  emailInput: string;
  constructor(private alertifyService:AlertifyService){};


  validateForm() {
    if (!this.emailInput || this.emailInput.trim() === "") {
      this.alertifyService.error("Molimo unesite vaš email.");
      return false;
    }

    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailPattern.test(this.emailInput)) {
      this.alertifyService.error("Molimo unesite validan email.");
      return false;
    }
    this.alertifyService.success("Pretplata uspešna! Hvala vam što pratite aktuelnosti o koncertu.");
    this.emailInput="";
    return true;
  }

}
