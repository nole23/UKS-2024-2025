import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Dodajte ovo!
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Dodajte ovo

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';  // Importuj AppRoutingModule
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './headers/header/header.component';
import { NotificationsComponent } from './headers/notifications/notifications.component';
import { UserProfileLightComponent } from './users/user-profile-light/user-profile-light.component';
import { RepositoryService } from './docker-hub/services/repository.service';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './users/profile/profile.component';
import { ContactComponent } from './common/support/contact/contact.component';
import { EditProfileComponent } from './users/edit-profile/edit-profile.component';
import { AccountInformationComponent } from './users/edit-profile/account-information/account-information.component';
import { ProfileBasicComponent } from './users/edit-profile/profile/profile-basic.component';
import { EmailComponent } from './users/edit-profile/email/email.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NotificationsComponent,
    UserProfileLightComponent,
    ProfileComponent,
    ContactComponent,
    EditProfileComponent,
    AccountInformationComponent,
    ProfileBasicComponent,
    EmailComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Dodajte ovo za osnovnu rutu ili obavezno postavite rute
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [RepositoryService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }