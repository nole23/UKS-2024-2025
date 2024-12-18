import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Dodajemo za rad sa formularima

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;

  beforeEach(async () => {
    // Kreiramo mock za Router
    routerMock = {
      navigate: jasmine.createSpy('navigate')  // Mockujemo navigate metodu
    };

    // Mockovanje localStorage koristeći Object.defineProperty
    const localStorageMock = {
      setItem: jasmine.createSpy('setItem'),
      getItem: jasmine.createSpy('getItem').and.returnValue(null),  // Početna vrednost je null
      clear: jasmine.createSpy('clear')
    };

    // Koristimo Object.defineProperty za mock-ovanje localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock
    });

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],  // Potrebno za rad sa formama
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  // Proveravamo da li je komponenta uspešno kreirana
  });
});
