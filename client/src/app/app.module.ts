import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Dodajte ovo!
import { FormsModule } from '@angular/forms'; // Dodajte ovo

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';  // Importuj AppRoutingModule

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Dodajte ovo za osnovnu rutu ili obavezno postavite rute
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }