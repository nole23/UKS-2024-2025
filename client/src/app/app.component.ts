import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './common/service/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'User Management App';
  isAuthoriz: boolean;

  constructor(private router: Router, private globalService: GlobalService) {
    this.isAuthoriz = false;
  }

  ngOnInit(): void {
    this.isAuthoriz = this.globalService.checkUserLoggedIn()
  }

  // Ova funkcija može biti korišćena da preusmeri korisnika na login ekran ako nije ulogovan
  logout() {
    // Ukloni token kada korisnik izađe
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);  // Preusmeravanje na login ekran
  }
}