import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GlobalService } from './common/service/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private globalService: GlobalService, private router: Router) {}

  canActivate() {
    if (this.globalService.checkUserLoggedIn()) {
      return true;  // Dozvoljava pristup ako je korisnik ulogovan
    } else {
      this.router.navigate(['/auth']);  // Preusmerava na login ako nije ulogovan
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedGuard implements CanActivate {
  constructor(private globalService: GlobalService, private router: Router) {}

  canActivate() {
    if (!this.globalService.checkUserLoggedIn()) {
      return true;  // Dozvoljava pristup ako nije ulogovan
    } else {
      this.router.navigate(['/dashboard']);  // Preusmerava na dashboard ako je ulogovan
      return false;
    }
  }
}