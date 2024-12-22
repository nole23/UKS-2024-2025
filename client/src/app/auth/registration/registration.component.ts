import { Component } from '@angular/core';
import { Registration } from '../model/registration';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm: Registration;
  emailFormatError: boolean;
  usernameFormatError: boolean;
  firstNameFormatError: boolean;
  lastNameFormatError: boolean;
  emailExistError: boolean;
  usernameExistError: boolean;
  passwordAggainError: boolean;
  passwordLengtError: boolean;

  constructor(private router: Router, private authService: AuthService) {
    this.registrationForm = new Registration('', '', '', '', '', '');
    this.emailExistError = false;
    this.emailFormatError = false;
    this.usernameExistError = false;
    this.passwordAggainError = false;
    this.usernameFormatError = false;
    this.firstNameFormatError = false;
    this.lastNameFormatError = false;
    this.passwordLengtError = false;
  }

  onSubmit() {
    if (this.registrationForm.isValid()) {
      this.authService.registrationUsers(this.registrationForm).subscribe((res: any) => {
        if (res.status) {
          alert(`User ${this.registrationForm.first_name + ' ' + this.registrationForm.last_name} is successed saved.`)
          this.router.navigate(['/auth/login']);
        } else {
          alert(res.message.message)
          if (res.message.type === 'email') {
            this.emailExistError = true;
          } else if (res.message.type === 'username') {
            this.usernameExistError = true;
          }
        }
      })
      
    } else {
      this.emailFormatError = !this.registrationForm.isValidEmail(this.registrationForm.email);
      this.passwordLengtError = !this.registrationForm.isValidPassword(this.registrationForm.password);
      this.usernameFormatError = !this.registrationForm.isValidUsername(this.registrationForm.username);
      this.firstNameFormatError = !this.registrationForm.isValidName(this.registrationForm.first_name);
      this.lastNameFormatError = !this.registrationForm.isValidName(this.registrationForm.last_name);
      this.passwordAggainError = !this.registrationForm.doPasswordsMatch();
    }
  }
}
