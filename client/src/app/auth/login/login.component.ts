import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../model/login';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credential: Login;
  emailError: boolean;
  passwordError: boolean;
  globalError: boolean;

  constructor(private authService: AuthService) {
    // Inicializacija 'credential' sa praznim vrednostima
    this.credential = new Login('', '');
    this.emailError = false;
    this.passwordError = false;
    this.globalError = false;
  }

  onSubmit() {
    if (this.credential.isValid()) {
      this.authService.login(this.credential).subscribe((res: any) => {
        if (res.status) {
          window.location.reload();
        } else {
          alert(res.messsage)
          this.globalError = true;
        }
      })
      
    } else {
      this.emailError = !this.credential.isValidEmail(this.credential.email);
      this.passwordError = !this.credential.isValidPassword(this.credential.password);
    }
  }
}