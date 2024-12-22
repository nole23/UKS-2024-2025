import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard, UnauthenticatedGuard } from './auth.guard';  // Importujte vašu guard klasu
import { GlobalService } from './common/service/global.service';  // Importujte GlobalService
import { of } from 'rxjs';  // Koristi se za mock-ovanje odgovora

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let unauthenticatedGuard: UnauthenticatedGuard;
  let globalServiceMock: jasmine.SpyObj<GlobalService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Kreiramo mock servise
    globalServiceMock = jasmine.createSpyObj('GlobalService', ['checkUserLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        UnauthenticatedGuard,
        { provide: GlobalService, useValue: globalServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    // Inicijalizujemo guardove
    authGuard = TestBed.inject(AuthGuard);
    unauthenticatedGuard = TestBed.inject(UnauthenticatedGuard);
  });

  it('should allow access if user is logged in (AuthGuard)', () => {
    // Simulirajmo da je korisnik ulogovan
    globalServiceMock.checkUserLoggedIn.and.returnValue(true);

    const canActivate = authGuard.canActivate();

    expect(canActivate).toBe(true);  // Pristup je omogućen
    expect(routerMock.navigate).not.toHaveBeenCalled();  // Ne treba biti pozvano preusmeravanje
  });

  it('should redirect to /auth if user is not logged in (AuthGuard)', () => {
    // Simulirajmo da korisnik nije ulogovan
    globalServiceMock.checkUserLoggedIn.and.returnValue(false);

    const canActivate = authGuard.canActivate();

    expect(canActivate).toBe(false);  // Pristup je odbijen
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth']);  // Treba da se preusmeri na login
  });

  it('should allow access if user is not logged in (UnauthenticatedGuard)', () => {
    // Simulirajmo da korisnik nije ulogovan
    globalServiceMock.checkUserLoggedIn.and.returnValue(false);

    const canActivate = unauthenticatedGuard.canActivate();

    expect(canActivate).toBe(true);  // Pristup je omogućen
    expect(routerMock.navigate).not.toHaveBeenCalled();  // Ne treba biti pozvano preusmeravanje
  });

  it('should redirect to /dashboard if user is logged in (UnauthenticatedGuard)', () => {
    // Simulirajmo da je korisnik ulogovan
    globalServiceMock.checkUserLoggedIn.and.returnValue(true);

    const canActivate = unauthenticatedGuard.canActivate();

    expect(canActivate).toBe(false);  // Pristup je odbijen
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);  // Treba da se preusmeri na dashboard
  });
});
