import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';  // Koristimo 'of' za uspešne odgovore

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    // Kreiramo mock za Router
    routerMock = {
      navigate: jasmine.createSpy('navigate')  // Mockujemo navigate metodu
    };

    // Kreiramo mock za AuthService
    authServiceMock = {
      login: jasmine.createSpy('login')
    };

    // Mockovanje localStorage koristeći Object.defineProperty
    const localStorageMock = {
      setItem: jasmine.createSpy('setItem'),
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      clear: jasmine.createSpy('clear')
    };

    // Koristimo Object.defineProperty za mock-ovanje localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock
    });

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }  // Koristimo mock za AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize credential, emailError, passwordError, and globalError correctly', () => {
    expect(component.credential).toBeDefined();
    expect(component.emailError).toBeFalse();
    expect(component.passwordError).toBeFalse();
    expect(component.globalError).toBeFalse();
  });
  
  it('should show global error message on failed login', () => {
    // Podesimo mock da login vrati neuspešan odgovor
    authServiceMock.login.and.returnValue(of({ status: false, message: 'Invalid credentials' }));

    // Popunjavamo validne podatke
    component.credential.email = 'test@example.com';
    component.credential.password = 'wrongpassword';

    // Pozivamo metodu onSubmit
    component.onSubmit();

    // Proveravamo da li je postavljen globalError na true
    expect(component.globalError).toBeTrue();
  });

  it('should set emailError and passwordError to true if the form is invalid', () => {
    // Podesimo nevalidne podatke
    component.credential.email = 'invalid-email';
    component.credential.password = 'short';

    // Pozivamo metodu onSubmit
    component.onSubmit();

    // Proveravamo da li je emailError postavljen na true
    expect(component.emailError).toBeTrue();
    expect(component.passwordError).toBeTrue();
  });

  it('should validate email correctly', () => {
    // Testiramo ispravnost email validacije
    expect(component.credential.isValidEmail('test@example.com')).toBeTrue();
    expect(component.credential.isValidEmail('invalid-email')).toBeFalse();
  });

  it('should validate password correctly', () => {
    // Testiramo ispravnost password validacije
    expect(component.credential.isValidPassword('password123')).toBeTrue();
    expect(component.credential.isValidPassword('short')).toBeFalse();
  });
});
