import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';  // Dodajemo RouterModule ako koristiš router-outlet
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from '../common/footer/footer.component';

describe('AuthComponent', () => {
  let fixture: ComponentFixture<AuthComponent>;
  let component: AuthComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]), // Dodavanje osnovnih ruta, ako koristiš router-outlet
      ],
      declarations: [AuthComponent, HeaderComponent, FooterComponent], // Dodajemo HeaderComponent i FooterComponent
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render <app-header> element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();  // Proverava da li je <app-header> prisutan u DOM-u
  });
});
