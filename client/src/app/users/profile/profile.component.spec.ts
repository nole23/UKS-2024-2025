import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Mock UserService
    mockUserService = jasmine.createSpyObj('UserService', ['getAuthorizedUser', 'logout']);

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profile if user is authorized', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com' };
    mockUserService.getAuthorizedUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(mockUserService.getAuthorizedUser).toHaveBeenCalled();
    expect(component.profile).toEqual(mockUser);
  });

  it('should call logout and alert if user is not authorized', () => {
    spyOn(window, 'alert');
    mockUserService.getAuthorizedUser.and.returnValue(null);

    component.ngOnInit();

    expect(mockUserService.getAuthorizedUser).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('User is not authorized');
    expect(mockUserService.logout).toHaveBeenCalled();
  });

  it('should return first uppercase letter of a word', () => {
    expect(component.getFirstUppercaseLetter('angular')).toBe('A');
    expect(component.getFirstUppercaseLetter('')).toBe('');
    expect(component.getFirstUppercaseLetter(null as any)).toBe('');
  });

  it('should render profile details in the template', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com' };
    mockUserService.getAuthorizedUser.and.returnValue(mockUser);

    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.profile-up-left-img-word')?.textContent).toBe('T'); // First uppercase letter
    expect(compiled.querySelector('h3')?.textContent).toBe(mockUser.email);
    expect(compiled.querySelector('a')?.getAttribute('href')).toContain(`/u/setting/${mockUser.username}`);
  });
});
