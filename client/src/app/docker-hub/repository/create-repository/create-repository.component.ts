import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-create-repository',
  templateUrl: './create-repository.component.html',
  styleUrl: './create-repository.component.css'
})
export class CreateRepositoryComponent implements OnInit {
  form: FormGroup;
  profile: any = {};
  repositoryName: string = '';
  repositoryDescriton: string = '';
  repositoryVisibility: boolean = true;

  constructor(private userService: UserService, private fb: FormBuilder, private repository: RepositoryService, private router: Router) {
    this.form = this.fb.group({
      repositoryName: ['', Validators.required],
      repositoryDescriton: ['', [Validators.required, Validators.required]],
    });
  }

  ngOnInit(): void {
    let user = this.userService.getAuthorizedUser();
    if (user !== null) {
      this.profile = user;
    }
  }

  createNewRepository() {
    let newRepository = {
      name: this.repositoryName,
      description: this.repositoryDescriton,
      is_private: this.repositoryVisibility,
      username: this.profile.username
    }

    this.repository.createNewRepository(newRepository).subscribe((res: any) => {
      if (res.status) {
        this.router.navigate(['/dashboard'])
      } else {
        alert('Repository is not saved')
      }
    })
  }
}
