import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Importuj RouterTestingModule
import { Router } from '@angular/router';
import { GlobalService } from '../../common/service/global.service';
import { UserProfileLightComponent } from './user-profile-light.component';

describe('UserProfileLightComponent', () => {
  let component: UserProfileLightComponent;
  let fixture: ComponentFixture<UserProfileLightComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
    // Mock za Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Mock za GlobalService
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['checkUserLoggedIn']);
    
    // Konfiguracija TestBed-a sa RouterTestingModule
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],  // Dodaj RouterTestingModule za testiranje ruta
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GlobalService, useValue: globalServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileLightComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
