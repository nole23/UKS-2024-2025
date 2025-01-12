import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsComponent } from './tags.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { RepositoryService } from '../../../services/repository.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock za UserService
class MockUserService {
  getAuthorizedUser() {
    return { username: 'TestUser' };
  }
  logout() {}
}

// Mock za RepositoryService
class MockRepositoryService {
  getOneRepositoryByName(name: string, username: string) {
    return of({
      status: true,
      message: { id: 1, name: 'TestRepo', description: 'Test description', settings: { is_private: true } }
    });
  }
  getTagsByRepository(id: number) {
    return of({
      status: true,
      message: [
        { id: 1, tag: 'v1.0.0', name: 'tag1', updated_at: new Date() },
        { id: 2, tag: 'v1.1.0', name: 'tag2', updated_at: new Date() }
      ]
    });
  }
  removeTags(ids: number[]) {
    return of({ status: true });
  }
  addNewTag(repositoryId: number, newTag: any, username: string) {
    return of({ status: true, message: { id: 3, tag: newTag.version, name: newTag.name, updated_at: new Date() } });
  }
}

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let userService: UserService;
  let repositoryService: RepositoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [TagsComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: RepositoryService, useClass: MockRepositoryService },
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

    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    repositoryService = TestBed.inject(RepositoryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data', () => {
    const user = userService.getAuthorizedUser();
    expect(user.username).toBe('TestUser');
  });

  it('should get repository and tags data on init', () => {
    spyOn(repositoryService, 'getOneRepositoryByName').and.callThrough();
    spyOn(repositoryService, 'getTagsByRepository').and.callThrough();

    component.ngOnInit();
    
    expect(repositoryService.getOneRepositoryByName).toHaveBeenCalled();
    expect(repositoryService.getTagsByRepository).toHaveBeenCalled();
  });

  it('should toggle all checkboxes when "removeCheck" checkbox is clicked', () => {
    component.tags = [{ selected: false }, { selected: false }];
    component.form.get('removeCheck')?.setValue(true);

    component.toggleAllCheckboxes();

    expect(component.tags.every((tag: any) => tag.selected)).toBeTrue();
  });

  it('should update "anySelected" when a tag checkbox is clicked', () => {
    component.tags = [{ selected: false }, { selected: false }];
    component.onTagCheckboxChange();

    expect(component.anySelected).toBeFalse();

    component.tags[0].selected = true;
    component.onTagCheckboxChange();

    expect(component.anySelected).toBeTrue();
  });

  it('should delete selected tags', () => {
    spyOn(repositoryService, 'removeTags').and.callThrough();

    component.tags = [
      { id: 1, selected: true },
      { id: 2, selected: false }
    ];
    
    component.deleteSelectedTags();

    expect(repositoryService.removeTags).toHaveBeenCalledWith([1]);
    expect(component.tags.length).toBe(1);
  });

  it('should add a new tag', () => {
    spyOn(repositoryService, 'addNewTag').and.callThrough();
    const newTag = { version: '1.0.1', name: 'new-tag', description: 'new tag description' };

    component.tagForm.setValue(newTag);
    component.onSubmit();

    expect(repositoryService.addNewTag).toHaveBeenCalled();
    expect(component.tags.length).toBe(3);
  });

  it('should reset form and close modal after adding new tag', () => {
    spyOn(component.closeButton.nativeElement, 'click');

    component.tagForm.setValue({ version: '1.0.1', name: 'new-tag', description: 'new description' });
    component.onSubmit();

    expect(component.tagForm.value).toEqual({ version: '1.0.0', name: '', description: '' });
    expect(component.closeButton.nativeElement.click).toHaveBeenCalled();
  });
});
