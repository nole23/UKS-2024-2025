import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'User Management App';

  constructor(private router: Router) {}

  // Ova funkcija može biti korišćena da preusmeri korisnika na login ekran ako nije ulogovan
  logout() {
    // Ukloni token kada korisnik izađe
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);  // Preusmeravanje na login ekran
  }
}