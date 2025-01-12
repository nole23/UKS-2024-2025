import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockRepositoryService: any;
  let mockUserService: any;
  let mockRouter: any;

  beforeEach(async () => {
    // Mock za RepositoryService
    mockRepositoryService = {
      getOneRepositoryByName: jasmine.createSpy('getOneRepositoryByName').and.returnValue(of({
        status: true,
        message: { id: 1, name: 'TestRepo', description: 'Test description', settings: { is_private: true } }
      })),
      updateSettings: jasmine.createSpy('updateSettings').and.returnValue(of({ status: true })),
      removeReposiroty: jasmine.createSpy('removeReposiroty').and.returnValue(of({ status: true })) // Ovdje se koristi spy
    };
  
    // Mock za UserService
    mockUserService = {
      getAuthorizedUser: jasmine.createSpy('getAuthorizedUser').and.returnValue({ username: 'TestUser' }),
      logout: jasmine.createSpy('logout')
    };
  
    // Mock za Router
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
  
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        { provide: RepositoryService, useValue: mockRepositoryService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of({
                get: (key: string) => (key === 'repository-name' ? 'TestRepo' : null)
              })
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user and repository data', () => {
    expect(mockUserService.getAuthorizedUser).toHaveBeenCalled();
    expect(mockRepositoryService.getOneRepositoryByName).toHaveBeenCalledWith('TestRepo', 'TestUser');
    expect(component.repositoryData.name).toBe('TestRepo');
    expect(component.repositoryData.settings.is_private).toBe(true);
    expect(component.profile.username).toBe('TestUser');
  });

  it('should reset repository data to previous state on restart', () => {
    const previousData = { id: 1, name: 'TestRepo', description: 'Test description', settings: { is_private: true } };
    component.repositoryData = { id: 1, name: 'NewRepo', description: 'New description', settings: { is_private: false } };
    component.repositoryDataBack = previousData;

    component.restart();
    expect(component.repositoryData).toEqual(previousData);
  });

  it('should show modal and confirm repository deletion', () => {
    const deleteButton = fixture.debugElement.query(By.css('button[data-bs-toggle="modal"]'));
    deleteButton.triggerEventHandler('click', null);

    const modal = fixture.debugElement.query(By.css('#exampleModal'));
    expect(modal).toBeTruthy();

    const yesButton = modal.query(By.css('.btn-primary'));
    yesButton.triggerEventHandler('click', null);

    expect(mockRepositoryService.removeReposiroty).toHaveBeenCalledWith(component.repositoryData.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call logout if user is not authorized', () => {
    mockUserService.getAuthorizedUser.and.returnValue(null);
    component.ngOnInit();
    expect(mockUserService.logout).toHaveBeenCalled();
  });
});
