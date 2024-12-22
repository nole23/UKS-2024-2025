import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Dodaj ovo

import { LoginComponent } from './login/login.component';  // Proveri da li je komponenta pravilno uvezena
import { AuthComponent } from './auth.component';
import { HeaderComponent } from './common/header/header.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FooterComponent } from '../common/footer/footer.component';
import { AuthService } from './services/auth.service';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AuthComponent]
})
export class AuthModule { }