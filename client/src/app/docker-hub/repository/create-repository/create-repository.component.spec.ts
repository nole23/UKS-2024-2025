// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // Dodaj FormsModule
// import { CreateRepositoryComponent } from './create-repository.component';
// import { UserService } from '../../services/user.service';
// import { RepositoryService } from '../../services/repository.service';
// import { Router } from '@angular/router';
// import { of } from 'rxjs';

// describe('CreateRepositoryComponent', () => {
//   let component: CreateRepositoryComponent;
//   let fixture: ComponentFixture<CreateRepositoryComponent>;
//   let userServiceMock: jasmine.SpyObj<UserService>;
//   let repositoryServiceMock: jasmine.SpyObj<RepositoryService>;
//   let routerMock: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     // Mock servisa
//     repositoryServiceMock = jasmine.createSpyObj('RepositoryService', ['createNewRepository']);
//     routerMock = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [CreateRepositoryComponent],
//       imports: [ReactiveFormsModule, FormsModule],  // Dodaj ReactiveFormsModule i FormsModule ovde
//       providers: [
//         { provide: RepositoryService, useValue: repositoryServiceMock },
//         { provide: Router, useValue: routerMock },
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(CreateRepositoryComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   // Dodaj ovaj test da bi "describe" blok imao bar jedan test
//   // it('should create the component', () => {
//   //   expect(component).toBeTruthy();
//   // });

//   // Ostatak testova možeš ponovo omogućiti ako je potrebno
// });
