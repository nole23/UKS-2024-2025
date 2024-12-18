import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';  // Proveri da li je komponenta pravilno uvezena
import { AuthComponent } from './auth.component';
import { HeaderComponent } from './common/header/header.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FooterComponent } from '../common/footer/footer.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  bootstrap: [AuthComponent]
})
export class AuthModule { }