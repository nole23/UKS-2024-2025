import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Ovde bi bila logika za autentifikaciju korisnika
    if (this.username === 'user') {
      // Ulogovani korisnik
      localStorage.setItem('token', 'some-token');  // Sačuvaj token u localStorage
      this.router.navigate(['/']);  // Preusmeri na dashboard
    } else {
      alert('Invalid login!');
    }
  }
}