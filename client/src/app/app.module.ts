import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Dodajte ovo!
import { FormsModule } from '@angular/forms'; // Dodajte ovo

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';  // Importuj AppRoutingModule
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './headers/header/header.component';
import { NotificationsComponent } from './headers/notifications/notifications.component';
import { UserProfileLightComponent } from './users/user-profile-light/user-profile-light.component';
import { RepositoryService } from './docker-hub/services/repository.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NotificationsComponent,
    UserProfileLightComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Dodajte ovo za osnovnu rutu ili obavezno postavite rute
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [RepositoryService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }