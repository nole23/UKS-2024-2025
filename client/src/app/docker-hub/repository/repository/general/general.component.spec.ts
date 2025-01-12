import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralComponent } from './general.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RepositoryService } from '../../../services/repository.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Dodato

describe('GeneralComponent', () => {
  let component: GeneralComponent;
  let fixture: ComponentFixture<GeneralComponent>;
  let mockRepositoryService: any;
  let mockUserService: any;

  beforeEach(async () => {
    // Mock za RepositoryService
    mockRepositoryService = {
      getOneRepositoryByName: jasmine.createSpy('getOneRepositoryByName').and.returnValue(of({
        status: true,
        message: { id: 1, name: 'TestRepo', description: 'Test description', updated_at: '2025-01-01' }
      })),
      getTagsByRepository: jasmine.createSpy('getTagsByRepository').and.returnValue(of({
        status: true,
        data: [{ tag: 'v1.0', created_at: '2025-01-01', updated_at: '2025-01-02' }]
      })),
      updateRepository: jasmine.createSpy('updateRepository').and.returnValue(of({ status: true }))
    };

    // Mock za UserService
    mockUserService = {
      getAuthorizedUser: jasmine.createSpy('getAuthorizedUser').and.returnValue({ username: 'TestUser' }),
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      declarations: [GeneralComponent],
      imports: [ReactiveFormsModule, RouterTestingModule], // Dodato RouterTestingModule
      providers: [
        { provide: RepositoryService, useValue: mockRepositoryService },
        { provide: UserService, useValue: mockUserService },
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralComponent);
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
    expect(component.repositoryData.description).toBe('Test description');
    expect(component.profile.username).toBe('TestUser');
  });

  it('should toggle isShowDescription', () => {
    component.isShowDescription = true;
    component.isShowDescription = !component.isShowDescription;
    expect(component.isShowDescription).toBe(false);
  });

  it('should fetch tags on _getRepository call', () => {
    component['_getRepository']('TestRepo');
    expect(mockRepositoryService.getTagsByRepository).toHaveBeenCalledWith(1);
    expect(component.tagsData.length).toBe(1);
    expect(component.tagsData[0].tag).toBe('v1.0');
  });

  it('should format time correctly in getTimeAgo', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    expect(component.getTimeAgo(oneHourAgo)).toBe('last push 1 hour ago');
    expect(component.getTimeAgo(oneDayAgo)).toBe('last push 1 day ago');
  });

  it('should call logout if user is not authorized', () => {
    mockUserService.getAuthorizedUser.and.returnValue(null);
    component.ngOnInit();
    expect(mockUserService.logout).toHaveBeenCalled();
  });
});
