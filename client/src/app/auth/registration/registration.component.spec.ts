import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { CommonModule } from '@angular/common';  // Dodajemo CommonModule

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],  // Dodajemo CommonModule za osnovne direktive
      declarations: [RegistrationComponent]  // Registrujemo komponentu u declarations
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  // Proveravamo da li je komponenta uspešno kreirana
  });

  it('should render "registration works!"', () => {
    fixture.detectChanges();  // Osvežavamo DOM
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('registration works!');  // Proveravamo sadržaj u <p> tagu
  });
});
