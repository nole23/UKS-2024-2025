import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Dodaj ovo
import { AppComponent } from './app.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './headers/header/header.component';
import { GlobalService } from './common/service/global.service';
import { RepositoryService } from './docker-hub/services/repository.service'; // Importuj servis
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
    // Kreiramo špijuna za GlobalService
    const spy = jasmine.createSpyObj('GlobalService', ['checkUserLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, // Rutiranje za testove
        HttpClientTestingModule // Omogućava HttpClient u testovima
      ],
      declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent
      ],
      providers: [
        { provide: GlobalService, useValue: spy },
        RepositoryService // Dodaj i servis
      ]
    }).compileComponents();

    globalServiceSpy = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'User Management App'`, () => {
    expect(component.title).toEqual('User Management App');
  });

  it('should check if user is authorized on init', () => {
    globalServiceSpy.checkUserLoggedIn.and.returnValue(true); // Simuliramo ulogovanog korisnika
    component.ngOnInit();
    expect(component.isAuthoriz).toBeTrue();
  });

  it('should render footer always', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
